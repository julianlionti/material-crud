import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  Fragment,
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
} from '@material-ui/core'
import { FaFilter, FaArrowLeft } from 'react-icons/fa'
import Formulario, { CamposProps } from '../Form'
import useAxios, { Error } from '../../utils/useAxios'
import { useABM } from '../../utils/ABMContext'
import Dialog, { CartelState } from '../UI/Dialog'
import Ordenado from './Ordenado'
import useWindowSize from '../../utils/useWindowSize'
import { serialize } from 'object-to-formdata'
import { Translations } from '../../translate'
import CenteredCard from '../UI/CenteredCard'

export interface CRUD {
  onEdit?: () => void
  onDelete?: () => void
  edited?: boolean
  deleted?: boolean
  widthAbm: number
}

interface Props {
  url?: string
  name: string
  titleSize?: number
  gender?: 'M' | 'F'
  description: string
  fields: CamposProps[]
  renderItem: (vals: any) => ReactNode
  columns?: number
  columnsFilters?: number
  isFormData?: boolean
  onFinished?: (what: 'new' | 'add' | 'update' | 'delete', genero?: 'M' | 'F') => void
  onError?: (err: Error) => void
  Left?: ReactNode
  lang?: Translations
}

interface Paged {
  hasNextPage?: boolean
  nextPage?: number
  page: number
  totalDocs?: number
  totalPages?: number
}

export default memo((props: Props) => {
  const lastFilter = useRef<any>({})
  const {
    url,
    name,
    gender,
    description,
    fields,
    renderItem,
    columns,
    columnsFilters,
    isFormData,
    onFinished,
    titleSize,
    onError,
    Left,
    lang,
  } = props

  const called = useRef(false)

  const { list, add, edit: editABM, replace, deleteCall: deleteABM } = useABM<any>({})
  const { loading, response, call } = useAxios<any>({ onError })

  // const { enqueueSnackbar } = useSnackbar()

  const [paginated, setPaginated] = useState<Paged>({ page: 1 })
  const [cartel, setCartel] = useState<CartelState>({ visible: false })
  const [toolbar, setToolbar] = useState(false)
  const [editObj, setEditObj] = useState<object | null>(null)

  const { width } = useWindowSize()
  const classes = useClasses({ titleSize })

  const editing = editObj ? Object.keys(editObj!!).length > 0 : false
  const { borrado, item, _id, data } = response || {}
  useEffect(() => {
    if (item && !_id) {
      add([item])
      onFinished && onFinished('new', gender)
      setEditObj(null)
    } else if (item && _id) {
      editABM({ id: _id, item: { ...item, editado: true } })
      onFinished && onFinished('update', gender)
      setEditObj(null)
    } else if (borrado) {
      editABM({ id: _id, item: { ...borrado, borrado: true } })
      onFinished && onFinished('delete', gender)
      setCartel({ visible: false })
    }
  }, [item, _id, add, editABM, borrado, deleteABM, gender, onFinished])

  const { docs, page } = data || {}
  useEffect(() => {
    if (docs) {
      setPaginated(data)
      if (page === 1) {
        replace(docs)
      } else {
        add(docs)
      }
    }
  }, [add, data, docs, page, paginated, replace])

  useEffect(() => {
    if (!called.current) {
      call({ method: 'GET', url })
      called.current = true
    }
  }, [call, url])

  const onEditCall = useCallback((item) => setEditObj(item), [])
  const onDeleteCall = useCallback(
    (item) => {
      const it = item
      setCartel({
        visible: true,
        contenido: `¿Estás segure de borrar el ${it.nombre}? Esta accion no se puede deshacer?`,
        titulo: `${lang?.delete || 'Borrar'} ${name}`,
        onCerrar: (aceptado: boolean) => {
          if (aceptado) {
            call({ method: 'DELETE', data: { id: it._id }, url })
          } else {
            setCartel({ visible: false })
          }
        },
      })
    },
    [call, name, url, lang],
  )

  const filters = useMemo(() => {
    const items = fields
      .flat()
      .filter((e) => e.filter)
      .map(({ grow, ...etc }) => etc)
    const columnas = columnsFilters || 3
    return new Array(Math.ceil(items.length / columnas))
      .fill(null)
      .map((_) => items.splice(0, columnas))
  }, [columnsFilters, fields])

  const fieldsWithoutFilters = useMemo(
    () =>
      fields.map((cam) => {
        if (Array.isArray(cam)) {
          return cam.map(({ filter, ...etc }) => etc)
        }
        const { filter, ...etc } = cam
        return etc
      }),
    [fields],
  )

  const order = useMemo(() => fields.flat().filter((e) => e.sort), [fields])
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
            <Ordenado
              lang={lang}
              que={name}
              columnas={order}
              onOrden={(ordenado) => {
                lastFilter.current = {
                  ...lastFilter.current,
                  ordenado,
                  pagina: 1,
                }
                call({
                  method: 'GET',
                  params: lastFilter.current,
                  url,
                })
              }}
            />
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
                  filtros,
                  pagina: 1,
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
      {loading && <LinearProgress />}
      <Collapse in={!editObj} timeout="auto" unmountOnExit>
        <div className={classes.items}>
          {width &&
            list.map((e: any) => (
              <Fragment key={e._id}>
                {renderItem({
                  ...e,
                  onEdit: () => onEditCall(e),
                  onDelete: () => onDeleteCall(e),
                  ancho: (width - 320) / (columns || 3),
                })}
              </Fragment>
            ))}
        </div>
        {!loading && paginated.hasNextPage && (
          <div
            className={classes.verMas}
            onClick={() => {
              lastFilter.current = {
                ...lastFilter.current,
                pagina: paginated.nextPage,
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
              : lang?.new || `Nuev${gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''}`
          } ${name}`}
          subtitle={description}>
          <Formulario
            intials={editObj}
            loading={loading}
            accept={editing ? lang?.edit || 'Editar' : lang?.add || 'Agregar'}
            fields={fieldsWithoutFilters}
            onSubmit={(vals) => {
              let data = vals
              if (isFormData) {
                data = serialize(vals, {
                  indices: true,
                  allowEmptyArrays: true,
                })
              }

              call({
                method: 'POST',
                data,
                url,
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
