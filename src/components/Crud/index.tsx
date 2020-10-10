import React, { useState, useEffect, useRef, ReactNode, useCallback, memo, useMemo } from 'react'
import {
  Typography,
  Divider,
  Collapse,
  makeStyles,
  Button,
  LinearProgress,
} from '@material-ui/core'
import { FaFilter } from 'react-icons/fa'
import Formulario, { CamposProps } from '../Form'
import useAxios, { CallProps, Error } from '../../utils/useAxios'
import { PaginationProps, ReplaceProps, useABM } from '../../utils/DataContext'
import Dialog, { CartelState } from '../UI/Dialog'
import { serialize } from 'object-to-formdata'
import CenteredCard from '../UI/CenteredCard'
import AlTable, { TableProps } from '../Crud/TableWindow'
import { Interactions, Types } from '../Form/Types'
import { useLang } from '../../utils/CrudContext'

export interface CRUD {
  onEdit?: () => void
  onDelete?: () => void
  edited?: boolean
  deleted?: boolean
  cardWidth: number
}

interface ListConfiguration extends PaginationProps {
  data: string
  items: string
}

interface OnFlyResponse extends PaginationProps {
  items: any[]
}

interface ResponseProps {
  list: (data: any) => OnFlyResponse
  new: (data: any, responseWs?: any) => any
  edit: (data: any, responseWs?: any) => any
}

export interface CrudProps {
  url: string
  name: string
  titleSize?: number
  gender?: 'M' | 'F'
  description: string
  fields: CamposProps[]
  table: TableProps
  filtersPerRow?: number
  isFormData?: boolean
  onFinished?: (what: 'new' | 'update' | 'delete', genero?: 'M' | 'F') => void
  onError?: (err: Error) => void
  Left?: ReactNode
  idInUrl?: boolean
  response: ResponseProps
  interaction?: Interactions
  itemId?: 'id' | '_id' | string
  itemName?: string // PAra borrar
  transformEdit?: (row: any) => Object // Para el editar
  transformFilter?: (row: any) => {} // Para manipular lo q se envia
}

interface DataCallProps {
  url: string
  call: CallProps
  response: ResponseProps
  replace: (props: ReplaceProps) => void
  params?: any
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
  setCartel: (value: React.SetStateAction<CartelState | null>) => void
}

const postData = async (props: NoGetCallProps) => {
  const { url, data, editing, idInUrl, itemId, onFinished, isDelete, gender } = props
  const { call, response, editABM, add, deleteCall, setEditObj, setCartel } = props
  const finalId = data[itemId]
  let finalURL = url
  if ((editing || isDelete) && idInUrl && url?.slice(-1) !== '/')
    finalURL = finalURL + '/' + finalId

  const { response: responseWs, status } = await call({
    method: isDelete ? 'DELETE' : editing && idInUrl ? 'PUT' : 'POST',
    url: finalURL,
    data,
  })

  if (status!! >= 200 && status!! < 300) {
    if (isDelete) {
      deleteCall(finalId)
      setCartel({ visible: false })
    } else if (editing) {
      const item = response?.edit(data, responseWs)
      editABM({ id: finalId, item: { ...item, edited: true } })
      setEditObj(null)
    } else {
      const item = response?.new(data, responseWs)
      add([item])
      setEditObj(null)
    }
    onFinished && onFinished(isDelete ? 'delete' : editing ? 'update' : 'new', gender)
  }
}

const getData = async ({ call, response, replace, params, url }: DataCallProps) => {
  const { response: responseWs, status } = await call({
    method: 'GET',
    url,
    params,
  })

  if (status!! >= 200 && status!! < 300) {
    const { items, ...data } = response?.list(responseWs) || { page: 1 }
    replace({ items: items || [], pagination: data })
  }
}

export default memo((props: CrudProps) => {
  const lastFilter = useRef<any>({})
  const {
    url,
    name,
    gender,
    description,
    fields,
    table,
    filtersPerRow,
    isFormData,
    onFinished,
    titleSize,
    onError,
    Left,
    idInUrl,
    response,
    itemName,
    interaction,
    transformEdit,
    transformFilter,
  } = props

  const lang = useLang()
  const called = useRef(false)

  const { add, edit: editABM, replace, deleteCall, pagination, itemId } = useABM()
  const { loading, response: responseWS, call } = useAxios<any>({ onError })

  const [cartel, setCartel] = useState<CartelState>({ visible: false })
  const [toolbar, setToolbar] = useState(false)
  const [editObj, setEditObj] = useState<object | null>(null)

  const editing = useMemo(() => (editObj ? Object.keys(editObj!!).length > 0 : false), [editObj])

  const getDataCall = useCallback((params) => getData({ call, params, replace, response, url }), [
    call,
    replace,
    response,
    url,
  ])
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

  const onEditCall = useCallback((item) => setEditObj(item), [])
  const onDeleteCall = useCallback(
    (item) => {
      const it = item
      setCartel({
        visible: true,
        contenido:
          itemName && lang?.delExplanation
            ? lang.delExplanation(it[itemName])
            : "Para setear este texto es necesario incluir el 'itemName' y 'lang'",
        titulo: `${lang?.delete || 'Borrar'} ${name}`,
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

  const filters = useMemo(() => {
    const items = fields
      .flat()
      .filter((e) => e.list?.filter)
      .map((props) => {
        if (props.type !== Types.Expandable) {
          const { grow, ...etc } = props
          return etc
        }

        return props
      })
    const columnas = filtersPerRow || 3
    return new Array(Math.ceil(items.length / columnas))
      .fill(null)
      .map((_) => items.splice(0, columnas))
  }, [filtersPerRow, fields])

  const fieldsWithoutFilters = useMemo(
    () =>
      fields
        .filter((e) => {
          if (!Array.isArray(e)) {
            if (e.type === Types.Expandable) return false
            return e.edit !== false
          }
          return true
        })
        .map((cam) => {
          if (Array.isArray(cam)) {
            return cam
              .filter((e) => {
                if (e.type === Types.Expandable) return false
                return e.edit !== false
              })
              .map(({ list, ...etc }) => etc)
          }
          const { list, ...etc } = cam
          return etc
        }),
    [fields],
  )

  // const order = useMemo(() => fields.flat().filter((e) => e.list?.sort), [fields])

  useEffect(() => {
    if (!called.current) {
      getDataCall(interactions)
      called.current = true
    }
  }, [getDataCall, interactions])

  return (
    <div className={classes.contenedor}>
      <Collapse in={!editObj} timeout="auto" unmountOnExit>
        <div className={classes.toolbarContainer}>
          <div className={classes.leftComponent}>
            {Left && <div hidden={loading}>{Left}</div>}
            <Typography gutterBottom={false} variant="h1" className={classes.title}>{`${
              toolbar ? lang?.filter || 'Filtrar' : lang?.listOf || 'Listado de '
            } ${name}`}</Typography>
          </div>
          <div>
            {Object.keys(filters || {}).length > 0 && (
              <Button
                color="primary"
                endIcon={<FaFilter />}
                disabled={!!editObj}
                className={classes.colapseBtn}
                onClick={() => setToolbar((t) => !t)}>
                {`${toolbar ? lang?.close || 'Cerrar' : lang?.open || 'Abrir'} ${
                  lang?.filters || 'filtros'
                }`}
              </Button>
            )}
            <Button
              disabled={!!editObj}
              color="primary"
              variant="outlined"
              className={classes.nuevoBtn}
              onClick={() => setEditObj({})}>
              {`${lang?.add || 'Agregar nuev'}${
                gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''
              } ${name}`}
            </Button>
          </div>
        </div>
        {filters && (
          <Collapse in={toolbar} timeout="auto" unmountOnExit>
            <Formulario
              accept={lang?.filter || 'Filtrar'}
              fields={filters}
              onSubmit={(filtros) => {
                lastFilter.current = {
                  ...lastFilter.current,
                  [interaction?.filter || 'filter']: filtros,
                  [interaction?.page || 'page']: 1,
                }

                const finalParams = transformFilter
                  ? transformFilter(lastFilter.current)
                  : lastFilter.current
                getDataCall(finalParams)
              }}
              noValidate
            />
          </Collapse>
        )}
      </Collapse>
      <Divider className={classes.divisor} />
      {loading && <LinearProgress />}
      <Collapse in={!editObj} timeout="auto" unmountOnExit>
        <AlTable
          {...table}
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
              [interaction?.page || lang?.pagination?.page || 'page']: page,
              [interaction?.perPage || lang?.pagination?.rowsPerPage || 'perPage']: perPage,
            })
          }}
          columns={table.columns || fields}
          onEdit={(rowData) => {
            const { onEdit } = table
            const editData = transformEdit ? transformEdit(rowData) : rowData
            if (onEdit) onEdit(editData)
            else onEditCall(editData)
          }}
          onDelete={(rowData) => {
            const { onDelete } = table
            if (onDelete) onDelete(rowData)
            else onDeleteCall(rowData)
          }}
        />
      </Collapse>
      <Collapse in={!!editObj} timeout="auto" unmountOnExit>
        <CenteredCard
          onClose={() => setEditObj(null)}
          title={`${
            editing
              ? lang?.edit || 'Editar '
              : lang?.new
              ? `${lang.new}${gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''}`
              : `Nuev${gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''}`
          } ${name}`}
          subtitle={description}>
          <Formulario
            intials={editObj}
            loading={loading}
            accept={
              editing
                ? lang?.edit || 'Editar'
                : lang?.add
                ? `${lang?.add || 'Agregar nuev'}${
                    gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''
                  } ${name}`
                : 'Agregar'
            }
            fields={fieldsWithoutFilters}
            onSubmit={(vals) => {
              let data = vals
              if (isFormData) {
                data = serialize(vals, {
                  indices: true,
                  allowEmptyArrays: true,
                })
              }
              postDataCall(data)
            }}
          />
        </CenteredCard>
      </Collapse>
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
  title: ({ titleSize }: any) => ({
    fontSize: titleSize || 26,
  }),
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tema.spacing(1),
    paddingLeft: tema.spacing(2),
    paddingRight: tema.spacing(2),
  },
  leftComponent: {
    display: 'flex',
    alignItems: 'center',
  },
  colapseBtn: {
    marginLeft: tema.spacing(2),
  },
  nuevoBtn: {
    marginLeft: tema.spacing(2),
  },
  colapseContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  divisor: {
    marginBottom: tema.spacing(3),
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
