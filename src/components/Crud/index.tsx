import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
  memo,
  useMemo,
} from 'react'
import {
  Typography,
  Divider,
  Collapse,
  makeStyles,
  Button,
  LinearProgress,
  FormControlLabel,
  Switch,
} from '@material-ui/core'
import { FaFilter } from 'react-icons/fa'
import Formulario, { CamposProps } from '../Form'
import useAxios, { Error } from '../../utils/useAxios'
import { PaginationProps, useABM } from '../../utils/DataContext'
import Dialog, { CartelState } from '../UI/Dialog'
import Ordenado from './Sort'
import useWindowSize from '../../utils/useWindowSize'
import { serialize } from 'object-to-formdata'
import CenteredCard from '../UI/CenteredCard'
import AnimatedItem from '../UI/AnimatedItem'
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
type ListOnFlyConfiguration = (data: any) => OnFlyResponse

export interface CrudProps {
  url?: string
  name: string
  titleSize?: number
  gender?: 'M' | 'F'
  description: string
  fields: CamposProps[]
  table?: TableProps
  renderItem?: (vals: any) => ReactNode
  cardsPerRow?: number
  filtersPerRow?: number
  isFormData?: boolean
  onFinished?: (what: 'new' | 'update' | 'delete', genero?: 'M' | 'F') => void
  onError?: (err: Error) => void
  Left?: ReactNode
  idInUrl?: boolean
  response?: {
    list: ListConfiguration | ListOnFlyConfiguration
    new: string
    edit: { item: string; id: string }
    delete: { item: string; id: string }
  }
  interaction?: Interactions
  itemId?: 'id' | '_id' | string
  itemName?: string // PAra borrar
  transformEdit?: (row: any) => Object // Para el editar
  transformFilter?: (row: any) => {} // Para manipular lo q se envia
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
    renderItem,
    cardsPerRow,
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
  const getCallRef = useRef(false)
  const lastCallRef = useRef<any>(null)

  const { list, add, edit: editABM, replace, deleteCall, pagination, itemId } = useABM()
  const { loading, response: responseWS, call } = useAxios<any>({ onError })

  // const [pagination, setPagination] = useState<PaginationProps>({ page: 1, limit: 10 })
  const [cartel, setCartel] = useState<CartelState>({ visible: false })
  const [toolbar, setToolbar] = useState(false)
  const [editObj, setEditObj] = useState<object | null>(null)
  const [viewCards, setViewCards] = useState(false)

  const { width } = useWindowSize()
  const classes = useClasses({ titleSize })

  const editing = editObj ? Object.keys(editObj!!).length > 0 : false
  const { deleted, item, edited } = useMemo(() => {
    if (!responseWS) return {}
    if (!response) {
      const { borrado, item, _id } = responseWS
      return {
        deleted: { item: borrado, id: _id },
        item,
        edited: {
          item,
          id: _id,
        },
      }
    }

    return {
      deleted: {
        item: responseWS[response.delete.item],
        id: responseWS[response.delete.id],
      },
      edited: {
        item: responseWS[response.edit.item],
        id: responseWS[response.edit.id],
      },
      item: responseWS[response.new],
    }
  }, [response, responseWS])

  useEffect(() => {
    if (lastCallRef.current === null) return
    if (item && !edited?.id) {
      add([item])
      onFinished && onFinished('new', gender)
      setEditObj(null)
      // setPagination((state) => ({ ...state, totalDocs: (state.totalDocs || 0) + 1 }))
      lastCallRef.current = null
    } else if (edited && edited?.item) {
      editABM({ id: edited.id, item: { ...edited.item, edited: true } })
      onFinished && onFinished('update', gender)
      setEditObj(null)
      lastCallRef.current = null
    } else if (deleted && deleted.item) {
      if (table) {
        deleteCall(deleted.id)
        // setPagination((state) => ({ ...state, totalDocs: (state.totalDocs || 1) - 1 }))
      } else {
        editABM({ id: deleted.id, item: { ...deleted.item, deleted: true } })
      }
      onFinished && onFinished('delete', gender)
      setCartel({ visible: false })
      lastCallRef.current = null
    }
  }, [
    item,
    edited,
    deleted,
    onFinished,
    setCartel,
    add,
    editABM,
    gender,
    table,
    deleteCall,
  ])

  const { data, docs, page } = useMemo(() => {
    if (!responseWS) return {}
    if (getCallRef.current === false) return {}
    getCallRef.current = false
    if (typeof response?.list === 'function') {
      const { items, ...data } = response.list(responseWS) as any
      return {
        docs: items,
        data,
        page: data.page,
      }
    } else {
      const data = responseWS[response?.list.data || 'data'] || { page: 1 }
      return {
        data,
        docs: data[response?.list.items || 'docs'],
        page: data[response?.list.page || 'page'],
      }
    }
  }, [responseWS, response])

  useEffect(() => {
    if (docs) {
      // setPagination(data!!)
      if (page === 1 || table) {
        replace(docs, data)
      } else {
        add(docs)
      }
    }
  }, [add, data, docs, page, replace, table])

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
            const data = { id: it[itemId] }
            lastCallRef.current = data

            let finalURL = url
            if (idInUrl && url?.slice(-1) !== '/')
              finalURL = finalURL + '/' + item[itemId]

            call({ method: 'DELETE', data, url: finalURL })
          } else {
            setCartel({ visible: false })
          }
        },
      })
    },
    [call, name, url, lang, itemId, itemName, idInUrl],
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

  const order = useMemo(() => fields.flat().filter((e) => e.list?.sort), [fields])

  useEffect(() => {
    if (!called.current) {
      call({ method: 'GET', url, params: interactions })
      called.current = true
      getCallRef.current = true
    }
  }, [call, url, interactions])

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
            {table && renderItem && (
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => setViewCards(!viewCards)}
                    value={viewCards}
                    color="primary"
                  />
                }
                label={lang?.showCards || 'Cartas'}
                labelPlacement="start"
              />
            )}
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
            {!table && (
              <Ordenado
                que={name}
                columnas={order}
                onOrden={(ordenado) => {
                  lastFilter.current = {
                    ...lastFilter.current,
                    [interaction?.sort || 'sort']: ordenado,
                  }
                  getCallRef.current = true
                  call({
                    method: 'GET',
                    params: { ...interactions, ...lastFilter.current },
                    url,
                  })
                }}
              />
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
                getCallRef.current = true

                const finalParams = transformFilter
                  ? transformFilter(lastFilter.current)
                  : lastFilter.current

                call({
                  method: 'GET',
                  params: finalParams,
                  url,
                })
              }}
              noValidate
            />
          </Collapse>
        )}
      </Collapse>
      <Divider className={classes.divisor} />
      {loading && !table && <LinearProgress />}
      <Collapse in={!editObj} timeout="auto" unmountOnExit>
        {(table && !viewCards && (
          <AlTable
            {...table}
            loading={loading}
            onSort={(newSort) => {
              lastFilter.current = {
                ...lastFilter.current,
                [interaction?.sort || 'sort']: newSort,
              }
              getCallRef.current = true
              call({
                method: 'GET',
                params: { ...interactions, ...lastFilter.current },
                url,
              })
            }}
            onChangePagination={(page, perPage) => {
              getCallRef.current = true
              call({
                method: 'GET',
                url,
                params: {
                  ...interactions,
                  [interaction?.page || lang?.pagination?.page || 'page']: page,
                  [interaction?.perPage ||
                  lang?.pagination?.rowsPerPage ||
                  'perPage']: perPage,
                },
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
        )) ||
          (renderItem && (
            <div className={classes.items}>
              {width &&
                list.map((e: any) => (
                  <AnimatedItem key={e[itemId]} edited={e.edited} deleted={e.deleted}>
                    {renderItem({
                      ...e,
                      onEdit: () => onEditCall(e),
                      onDelete: () => onDeleteCall(e),
                      cardWidth: (width - 320) / (cardsPerRow || 3),
                    })}
                  </AnimatedItem>
                ))}
            </div>
          ))}
        {!loading && pagination.hasNextPage && !table && (
          <div
            className={classes.verMas}
            onClick={() => {
              lastFilter.current = {
                ...lastFilter.current,
                [interaction?.page || 'page']: pagination.nextPage,
              }
              getCallRef.current = true
              call({
                method: 'GET',
                params: lastFilter.current,
                url,
              })
            }}>
            <Button variant="outlined" color="primary">
              {lang?.seeMore || 'Ver más'}
            </Button>
          </div>
        )}
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

              lastCallRef.current = data
              let finalURL = url
              if (idInUrl && url?.slice(-1) !== '/')
                finalURL = finalURL + '/' + vals[itemId]

              call({
                method: editing && idInUrl ? 'PUT' : 'POST',
                data,
                url: finalURL,
              })
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
