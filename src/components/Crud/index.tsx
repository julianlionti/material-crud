import React, { useState, useEffect, useRef, ReactNode, useCallback, memo, useMemo } from 'react'
import { Collapse, makeStyles, LinearProgress, Typography } from '@material-ui/core'
import { serialize } from 'object-to-formdata'
import qs from 'qs'
import { useLang } from '../../utils/CrudContext'
import { PaginationProps, ReplaceProps, useABM } from '../../utils/DataContext'
import useAxios, { CallProps, Error } from '../../utils/useAxios'
import Formulario from '../Form'
import { Interactions, FieldProps, StepProps } from '../Form/FormTypes'
import AlTable from '../Table/index'
import { ColumnsProps, TableProps } from '../Table/TableTypes'
import CenteredCard from '../UI/CenteredCard'
import Dialog, { CartelState } from '../UI/Dialog'
import Toolbar from './Toolbar'

interface OnFlyResponse extends PaginationProps {
  items: any[]
}

interface ResponseProps {
  list: (data: any) => OnFlyResponse
  new?: (data: any, responseWs?: any) => any
  edit?: (data: any, responseWs?: any) => any
}

export interface CrudProps extends TableProps {
  columns: ColumnsProps[]
  url: string
  name: string
  filters?: FieldProps[]
  steps?: StepProps[]
  fields?: FieldProps[]
  title?: string
  description?: string
  gender?: 'M' | 'F'
  itemId?: 'id' | '_id' | string
  itemName?: string // PAra borrar
  titleSize?: number
  noTitle?: boolean
  isFormData?: boolean
  idInUrl?: boolean
  Left?: ReactNode
  response: ResponseProps
  interaction?: Interactions
  onFinished?: (what: 'new' | 'update' | 'delete', genero?: 'M' | 'F') => void
  onError?: (err: Error) => void
  transform?: (what: 'query' | 'new' | 'update', rowData: any) => Record<string, any>
  transformToEdit?: (props: any) => any
  transformFilter?: (props: any) => any
}

interface DataCallProps {
  url: string
  call: CallProps
  response: ResponseProps
  replace: (props: ReplaceProps) => void
  params?: any
  transform?: (what: 'query' | 'new' | 'update', rowData: any) => Record<string, any>
}

interface NoGetCallProps extends DataCallProps {
  data: any
  editing: boolean
  isDelete?: boolean
  idInUrl?: boolean
  itemId: string
  onFinished?: (what: 'new' | 'update' | 'delete', genero?: 'M' | 'F') => void
  gender?: 'M' | 'F'
  setEditObj: (value: React.SetStateAction<object | null>) => void
  editABM: ({ id, item }: { id: string; item: object }) => void
  add: (items: object[]) => void
  deleteCall: (id: string) => void
  setCartel: (value: React.SetStateAction<CartelState>) => void
  transform?: (what: 'query' | 'new' | 'update', rowData: any) => Record<string, any>
  isFormData?: boolean
}

const postData = async (props: NoGetCallProps) => {
  const { url, data, editing, idInUrl, itemId, onFinished, isDelete, gender, transform } = props
  const { call, response, editABM, add, deleteCall, setEditObj, setCartel, isFormData } = props
  const finalId = data[itemId]
  let finalURL = url
  if ((editing || isDelete) && idInUrl) {
    finalURL = `${finalURL}${finalURL.substring(url.length - 1) === '/' ? '' : '/'}${finalId}/`
  }

  let finalData = transform ? transform(editing ? 'update' : 'new', data) : data
  if (isFormData && !isDelete) {
    finalData = serialize(finalData, {
      indices: true,
      allowEmptyArrays: true,
    })
  }

  const method = isDelete ? 'DELETE' : editing && idInUrl ? 'PUT' : 'POST'
  const { response: responseWs, status } = await call({
    method,
    url: finalURL,
    data: finalData,
  })

  if (status && status >= 200 && status < 300) {
    if (isDelete) {
      deleteCall(finalId)
      setCartel({ visible: false })
    } else if (editing && response.edit) {
      const item = response.edit(data, responseWs)
      editABM({ id: finalId, item: { ...item, edited: true } })
      setEditObj(null)
    } else if (response.new) {
      const item = response?.new(data, responseWs)
      add([item])
      setEditObj(null)
    }
    onFinished && onFinished(isDelete ? 'delete' : editing ? 'update' : 'new', gender)
  }
}

const getData = async ({ call, response, replace, params, url, transform }: DataCallProps) => {
  const finalParams = transform ? transform('query', params) : params
  const { response: responseWs, status } = await call({
    url,
    method: 'GET',
    params: finalParams,
    paramsSerializer: qs.stringify,
  })

  if (status && status >= 200 && status < 300) {
    const { items, ...data } = response?.list(responseWs) || { page: 1 }
    replace({ items: items || [], pagination: data })
  }
}

export default memo((props: CrudProps) => {
  const lastFilter = useRef<any>({})

  const { url, response, interaction, onFinished, onError, title, noTitle, transformFilter } = props
  const { Left, gender, description, isFormData, transform, transformToEdit } = props
  const { name, titleSize, idInUrl, itemName, fields, steps, filters } = props

  const lang = useLang()
  const called = useRef(false)

  const { add, edit: editABM, replace, deleteCall, pagination, itemId, columns } = useABM()
  const { loading, call } = useAxios<any>({ onError })

  const [cartel, setCartel] = useState<CartelState>({ visible: false })
  const [toolbar, setToolbar] = useState(false)
  const [editObj, setEditObj] = useState<object | null>(null)

  const editing = useMemo(() => (editObj ? Object.keys(editObj).length > 0 : false), [editObj])

  const getDataCall = useCallback(
    (params) => getData({ call, params, replace, response, url, transform }),
    [call, replace, response, url, transform],
  )
  const postDataCall = useCallback(
    (data, isDelete = false) =>
      postData({
        call,
        replace,
        response,
        url,
        data,
        editing,
        idInUrl,
        itemId,
        onFinished,
        gender,
        add,
        editABM,
        setEditObj,
        deleteCall,
        setCartel,
        isDelete,
        transform,
        isFormData,
      }),
    [
      call,
      replace,
      response,
      url,
      idInUrl,
      editing,
      itemId,
      onFinished,
      gender,
      add,
      editABM,
      setEditObj,
      deleteCall,
      setCartel,
      transform,
      isFormData,
    ],
  )

  const classes = useClasses({ titleSize })

  const interactions = useMemo(
    () => ({
      [interaction?.page || 'page']: pagination.page,
      [interaction?.perPage || 'perPage']: pagination.limit,
      ...lastFilter.current,
    }),
    [interaction, pagination],
  )

  const onEditCall = useCallback(
    (item) => {
      let finalItem = item
      if (transformToEdit) finalItem = transformToEdit(item)
      setEditObj(finalItem)
    },
    [transformToEdit],
  )

  const onDeleteCall = useCallback(
    (item) => {
      const it = item
      setCartel({
        visible: true,
        contenido: itemName
          ? lang.delExplanation(it[itemName])
          : "Para setear este texto es necesario incluir el 'itemName'",
        titulo: `${lang.delete} ${name}`,
        onCerrar: (aceptado: boolean) => {
          if (aceptado) {
            const data = { [itemId]: it[itemId] }
            postDataCall(data, true)
          } else {
            setCartel({ visible: false })
          }
        },
      })
    },
    [name, lang, itemId, itemName, postDataCall],
  )

  useEffect(() => {
    if (!called.current) {
      getDataCall(interactions)
      called.current = true
    }
  }, [getDataCall, interactions])

  if (columns.length === 0) {
    return <Typography>No están configuradas las columnas</Typography>
  }

  return (
    <div className={classes.contenedor}>
      <Toolbar
        fields={fields}
        filters={filters}
        steps={steps}
        hide={noTitle || (!filters && !fields)}
        editObj={editObj}
        Left={Left}
        onNew={() => setEditObj({})}
        noTitle={noTitle}
        gender={gender}
        title={title}
        loading={loading}
        name={name}
        show={toolbar}
        titleSize={titleSize}
        handleShow={() => {
          setToolbar((t) => {
            const final = !t
            if (!final) {
              lastFilter.current = {
                ...lastFilter.current,
                [interaction?.filter || 'filter']: {},
                [interaction?.page || 'page']: 1,
              }
              getDataCall(lastFilter.current)
            }
            return final
          })
        }}
        onFilter={(filters) => {
          let finalFilters = filters
          if (transformFilter) finalFilters = transformFilter(filters)

          lastFilter.current = {
            ...lastFilter.current,
            [interaction?.filter || 'filter']: finalFilters,
            [interaction?.page || 'page']: 1,
          }
          getDataCall(lastFilter.current)
        }}
      />
      {loading && <LinearProgress />}
      <Collapse in={!editObj} timeout="auto" unmountOnExit>
        <AlTable
          {...props}
          loading={loading}
          onSort={(newSort) => {
            lastFilter.current = {
              ...lastFilter.current,
              [interaction?.sort || 'sort']: newSort,
            }
            getDataCall({ ...interactions, ...lastFilter.current })
          }}
          onChangePagination={(page, perPage) => {
            getDataCall({
              ...interactions,
              [interaction?.page || lang.pagination?.page || 'page']: page,
              [interaction?.perPage || lang.pagination?.rowsPerPage || 'perPage']: perPage,
            })
          }}
          onEdit={(rowData) => onEditCall(rowData)}
          onDelete={(rowData) => onDeleteCall(rowData)}
        />
      </Collapse>
      {(fields || steps) && (
        <Collapse in={!!editObj} timeout="auto" unmountOnExit>
          <CenteredCard
            noPadding
            onClose={() => setEditObj(null)}
            title={`${
              editing
                ? lang.edit
                : lang.new
                ? `${lang.new}${gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''}`
                : `Nuev${gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''}`
            } ${name}`}
            subtitle={description}>
            <Formulario
              intials={editObj}
              loading={loading}
              accept={
                editing
                  ? lang.edit
                  : `${lang.add}${gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''} ${name}`
              }
              fields={fields}
              steps={steps}
              onSubmit={(vals) => postDataCall(vals)}
            />
          </CenteredCard>
        </Collapse>
      )}
      <Dialog
        show={cartel.visible}
        title={cartel?.titulo || ''}
        content={cartel?.contenido || ''}
        onClose={cartel.onCerrar}
        loading={loading}
      />
    </div>
  )
})

const useClasses = makeStyles((tema) => ({
  contenedor: {
    width: '85%',
    margin: '0 auto',
  },
  colapseContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  items: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  verMas: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: tema.spacing(1),
    marginBottom: tema.spacing(1),
  },
}))
