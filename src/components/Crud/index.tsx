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
import AnimatedItem from '../UI/AnimatedItem'

export interface ABM {
  onEditar?: () => void
  onBorrar?: () => void
  editado?: boolean
  borrado?: boolean
  ancho: number
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
  response?: {
    list: {
      data: string
      items: string
      page?: string
      hasNextPage?: string
      nextPage?: string
      totalDocs?: string
      totalPages?: string
    }
    new: string
    edit: { item: string; id: string }
    delete: { item: string; id: string }
  }
}

interface Paginado {
  hasNextPage?: boolean
  nextPage?: number
  page: number
  totalDocs?: number
  totalPages?: number
}

export default memo((props: Props) => {
  const ultimaBusqueda = useRef<any>({})
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
    response,
  } = props

  const llamado = useRef(false)

  const { listado, agregar, editar: editarABM, reemplazar, borrar } = useABM<any>({})
  const { cargando, respuesta, llamar } = useAxios<any>({
    onError,
  })

  // const { enqueueSnackbar } = useSnackbar()

  const [paginado, setPaginado] = useState<Paginado>({ page: 1 })
  const [cartel, setCartel] = useState<CartelState>({ visible: false })
  const [toolbar, setToolbar] = useState(false)
  const [editar, setEditar] = useState<object | null>(null)

  const { width } = useWindowSize()
  const clases = useClases({ titleSize })

  const editando = editar ? Object.keys(editar!!).length > 0 : false
  // const { borrado, item, _id, data } = respuesta || {}
  const { deleted, item, edited, data } = useMemo(() => {
    if (!respuesta) return {}
    if (!response) {
      const { borrado, item, _id, data } = respuesta
      return {
        deleted: { item: borrado, id: _id },
        item,
        edited: {
          item,
          id: _id,
        },
        data,
      }
    }

    return {
      data: respuesta[response.list.data],
      deleted: {
        item: respuesta[response.delete.item],
        id: respuesta[response.delete.id],
      },
      edited: {
        item: respuesta[response.edit.item],
        id: respuesta[response.edit.id],
      },
      item: respuesta[response.new],
    }
  }, [response, respuesta])

  useEffect(() => {
    if (item && !edited?.id) {
      agregar([item])
      onFinished && onFinished('new', gender)
      setEditar(null)
    } else if (edited && edited?.item) {
      editarABM({ id: edited.id, item: { ...edited.item, edited: true } })
      onFinished && onFinished('update', gender)
      setEditar(null)
    } else if (deleted && deleted.item) {
      editarABM({ id: deleted.id, item: { ...deleted.item, deleted: true } })
      onFinished && onFinished('delete', gender)
      setCartel({ visible: false })
    }
  }, [item, edited, deleted, onFinished, setCartel, agregar, editarABM, gender])

  const docs = data && data[response?.list.items || 'docs']
  const page = data && data[response?.list.page || 'page']
  useEffect(() => {
    if (docs) {
      setPaginado(data)
      if (page === 1) {
        reemplazar(docs)
      } else {
        agregar(docs)
      }
    }
  }, [agregar, data, docs, page, paginado, reemplazar, response])

  useEffect(() => {
    if (!llamado.current) {
      llamar({ method: 'GET', url })
      llamado.current = true
    }
  }, [llamar, url])

  const onEditar = useCallback((item) => {
    setEditar(item)
  }, [])

  const onBorrar = useCallback(
    (item) => {
      const it = item
      setCartel({
        visible: true,
        contenido: `¿Estás segure de borrar el ${it.nombre}? Esta accion no se puede deshacer?`,
        titulo: `${lang?.delete || 'Borrar'} ${name}`,
        onCerrar: (aceptado: boolean) => {
          if (aceptado) {
            llamar({ method: 'DELETE', data: { id: it._id }, url })
          } else {
            setCartel({ visible: false })
          }
        },
      })
    },
    [llamar, name, url, lang],
  )

  const filtros = useMemo(() => {
    const items = fields
      .flat()
      .filter((e) => e.filter)
      .map(({ grow, ...etc }) => etc)
    const columnas = columnsFilters || 3
    return new Array(Math.ceil(items.length / columnas))
      .fill(null)
      .map((_) => items.splice(0, columnas))
  }, [columnsFilters, fields])

  const camposSinFiltros = useMemo(
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

  const ordenar = useMemo(() => fields.flat().filter((e) => e.sort), [fields])
  return (
    <div className={clases.contenedor}>
      <Collapse in={!editar} timeout="auto" unmountOnExit>
        <div className={clases.toolbarContainer}>
          <div className={clases.leftComponent}>
            {Left && <div hidden={cargando}>{Left}</div>}
            <Typography gutterBottom={false} variant="h1" className={clases.title}>{`${
              toolbar ? lang?.filter || 'Filtrar' : lang?.listOf || 'Listado de '
            } ${name}`}</Typography>
          </div>
          <div>
            {Object.keys(filtros || {}).length > 0 && (
              <Button
                color="primary"
                endIcon={<FaFilter />}
                disabled={!!editar}
                className={clases.colapseBtn}
                onClick={() => setToolbar((t) => !t)}>
                {`${toolbar ? lang?.close || 'Cerrar' : lang?.open || 'Abrir'} ${
                  lang?.filters || 'filtros'
                }`}
              </Button>
            )}
            <Ordenado
              lang={lang}
              que={name}
              columnas={ordenar}
              onOrden={(ordenado) => {
                ultimaBusqueda.current = {
                  ...ultimaBusqueda.current,
                  ordenado,
                  pagina: 1,
                }
                llamar({
                  method: 'GET',
                  params: ultimaBusqueda.current,
                  url,
                })
              }}
            />
            <Button
              disabled={!!editar}
              color="primary"
              variant="outlined"
              className={clases.nuevoBtn}
              onClick={() => setEditar({})}>
              {`${lang?.add || 'Agregar nuev'}${
                gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''
              } ${name}`}
            </Button>
          </div>
        </div>
        {filtros && (
          <Collapse in={toolbar} timeout="auto" unmountOnExit>
            <Formulario
              accept={lang?.filter || 'Filtrar'}
              fields={filtros}
              onSubmit={(filtros) => {
                ultimaBusqueda.current = {
                  ...ultimaBusqueda.current,
                  filtros,
                  pagina: 1,
                }
                llamar({
                  method: 'GET',
                  params: ultimaBusqueda.current,
                  url,
                })
              }}
              noValidate
            />
          </Collapse>
        )}
      </Collapse>
      <Divider className={clases.divisor} />
      {cargando && <LinearProgress />}
      <Collapse in={!editar} timeout="auto" unmountOnExit>
        <div className={clases.items}>
          {width &&
            listado.map((e: any) => (
              <AnimatedItem key={e._id} edited={e.edited} deleted={e.deleted}>
                {renderItem({
                  ...e,
                  onEditar: () => onEditar(e),
                  onBorrar: () => onBorrar(e),
                  ancho: (width - 320) / (columns || 3),
                })}
              </AnimatedItem>
            ))}
        </div>
        {!cargando && paginado.hasNextPage && (
          <div
            className={clases.verMas}
            onClick={() => {
              ultimaBusqueda.current = {
                ...ultimaBusqueda.current,
                pagina: paginado.nextPage,
              }
              llamar({
                method: 'GET',
                params: ultimaBusqueda.current,
                url,
              })
            }}>
            <Button variant="outlined" color="primary">
              {lang?.seeMore || 'Ver más'}
            </Button>
          </div>
        )}
      </Collapse>
      <Collapse in={!!editar} timeout="auto" unmountOnExit>
        <CenteredCard
          onClose={() => setEditar(null)}
          title={`${
            editando
              ? lang?.edit || 'Editar '
              : lang?.new || `Nuev${gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''}`
          } ${name}`}
          subtitle={description}>
          <Formulario
            intials={editar}
            loading={cargando}
            accept={editando ? lang?.edit || 'Editar' : lang?.add || 'Agregar'}
            fields={camposSinFiltros}
            onSubmit={(vals) => {
              let data = vals
              if (isFormData) {
                data = serialize(vals, {
                  indices: true,
                  allowEmptyArrays: true,
                })
              }

              llamar({
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
        loading={cargando}
      />
    </div>
  )
})

const useClases = makeStyles((tema) => ({
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
