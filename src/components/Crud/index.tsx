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
import { useABM } from '../../utils/DataContext'
import Dialog, { CartelState } from '../UI/Dialog'
import Ordenado from './Sort'
import useWindowSize from '../../utils/useWindowSize'
import { serialize } from 'object-to-formdata'
import CenteredCard from '../UI/CenteredCard'
import AnimatedItem from '../UI/AnimatedItem'
import AlTable, { PaginationProps, TableProps } from '../Crud/AlTable'
import { Interactions } from '../Form/Types'
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
  usePut?: boolean
  response?: {
    list: ListConfiguration | ListOnFlyConfiguration
    new: string
    edit: { item: string; id: string }
    delete: { item: string; id: string }
  }
  interaction?: Interactions
  itemId?: 'id' | '_id' | string
  itemName?: string // PAra borrar
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
    usePut,
    response,
    itemId,
    itemName,
    interaction,
  } = props

  const lang = useLang()
  const itId = itemId || '_id'
  const called = useRef(false)

  const { list, add, edit: editABM, replace, deleteCall } = useABM<any>({ id: itId })
  const { loading, response: responseWS, call } = useAxios<any>({ onError })

  const [pagination, setPagination] = useState<PaginationProps>({ page: 1, limit: 10 })
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
    if (item && !edited?.id) {
      add([item])
      onFinished && onFinished('new', gender)
      setEditObj(null)
    } else if (edited && edited?.item) {
      editABM({ id: edited.id, item: { ...edited.item, edited: true } })
      onFinished && onFinished('update', gender)
      setEditObj(null)
    } else if (deleted && deleted.item) {
      if (table) {
        deleteCall(deleted.id)
      } else {
        editABM({ id: deleted.id, item: { ...deleted.item, deleted: true } })
      }
      onFinished && onFinished('delete', gender)
      setCartel({ visible: false })
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
    if (typeof response?.list === 'function') {
      if (!deleted?.item && !edited?.item && !item) {
        const { items, ...data } = response.list(responseWS) as any
        return {
          docs: items,
          data,
          page: data.page,
        }
      }
      return {}
    } else {
      const data = responseWS[response?.list.data || 'data'] || { page: 1 }
      return {
        data,
        docs: data[response?.list.items || 'docs'],
        page: data[response?.list.page || 'page'],
      }
    }
  }, [responseWS, response, deleted, edited, item])

  useEffect(() => {
    if (docs) {
      setPagination(data!!)
      if (page === 1 || table) {
        replace(docs)
      } else {
        add(docs)
      }
    }
  }, [add, data, docs, page, setPagination, replace, table])

  const interactions = useMemo(
    () => ({
      [interaction?.page || 'page']: pagination.page,
      [interaction?.perPage || 'perPage']: pagination.limit,
      ...lastFilter.current,
    }),
    [interaction, pagination],
  )

  useEffect(() => {
    if (!called.current) {
      call({ method: 'GET', url, params: interactions })
      called.current = true
    }
  }, [call, url, interactions])

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
            call({ method: 'DELETE', data: { id: it[itId] }, url })
          } else {
            setCartel({ visible: false })
          }
        },
      })
    },
    [call, name, url, lang, itId, itemName],
  )

  const filters = useMemo(() => {
    const items = fields
      .flat()
      .filter((e) => e.list?.filter)
      .map(({ grow, ...etc }) => etc)
    const columnas = filtersPerRow || 3
    return new Array(Math.ceil(items.length / columnas))
      .fill(null)
      .map((_) => items.splice(0, columnas))
  }, [filtersPerRow, fields])

  const fieldsWithoutFilters = useMemo(
    () =>
      fields
        .filter((e) => {
          if (!Array.isArray(e)) return e.edit !== false
          return true
        })
        .map((cam) => {
          if (Array.isArray(cam)) {
            return cam.filter((e) => e.edit !== false).map(({ list, ...etc }) => etc)
          }
          const { list, ...etc } = cam
          return etc
        }),
    [fields],
  )

  const order = useMemo(() => fields.flat().filter((e) => e.list?.sort), [fields])

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
                call({
                  method: 'GET',
                  params: lastFilter.current,
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
            loading={loading}
            {...table}
            pagination={pagination}
            onSort={(newSort) => {
              lastFilter.current = {
                ...lastFilter.current,
                [interaction?.sort || 'sort']: newSort,
              }
              call({
                method: 'GET',
                params: { ...interactions, ...lastFilter.current },
                url,
              })
            }}
            onChangePagination={(page, perPage) => {
              call({
                method: 'GET',
                url,
                params: {
                  ...interactions,
                  [interaction?.page || 'page']: page,
                  [interaction?.perPage || 'perPage']: perPage,
                },
              })
            }}
            columns={table.columns || fields}
            rows={list}
            onEdit={(rowData) => {
              const { onEdit } = table
              if (onEdit) onEdit(rowData)
              else onEditCall(rowData)
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
                  <AnimatedItem key={e[itId]} edited={e.edited} deleted={e.deleted}>
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
            interaction={interaction}
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

              let finalURL = url
              if (usePut && url?.slice(-1) !== '/') finalURL = finalURL + '/' + vals[itId]

              call({
                method: usePut ? 'PUT' : 'POST',
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
