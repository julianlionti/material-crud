export interface Translations {
  listOf: string
  new: string
  edit: string
  add: string
  delete: string
  crudCol: string
  delExplanation: (name: string) => string
  filters: string
  filter: string
  sort: string
  open: string
  close: string
  seeMore: string
  noOptions: string
  loading: string
  tooltips: {
    defineFilter: string
    cancel: string
  }
  pagination?: {
    rowsPerPage: string
    totalCount: string
  }
  inputs?: {
    image: { new: string; edit: string }
  }
  dialog?: { cancel: string; accept: string }
}

// Con la propiedad género se cambian las O por las A
const translations: Translations = {
  listOf: 'Listado de',
  new: 'Agregar nuevo',
  edit: 'Editar',
  add: 'Agregar',
  delete: 'Borrar',
  crudCol: 'Acciones',
  delExplanation: (name) =>
    `¿Estás segure de borrar el ${name}? Esta accion no se puede deshacer?`,
  filter: 'Filtrar',
  filters: 'filtros',
  sort: 'Orgenar',
  open: 'Abrir',
  close: 'Cerrar',
  seeMore: 'Ver más',
  noOptions: 'Sin opciones',
  loading: 'Cargando...',
  tooltips: {
    defineFilter: 'Definit TIPO de filtro',
    cancel: 'Cancelar',
  },
  pagination: {
    rowsPerPage: 'Filas por página',
    totalCount: 'Cantidad de items',
  },
  inputs: {
    image: {
      new: 'Haga click en la camara para subir una imagen.',
      edit: 'Haga click en la imagen para editarla.',
    },
  },
  dialog: {
    cancel: 'Cancelar',
    accept: 'Aceptar',
  },
}

export const createTranslation = (props: Translations) => props
export default translations
