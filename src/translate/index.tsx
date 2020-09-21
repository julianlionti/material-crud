export interface Translations {
  listOf: string
  new: string
  edit: string
  add: string
  delete: string
  delExplanation: string
  filters: string
  filter: string
  sort: string
  open: string
  close: string
  seeMore: string
  tooltips: {
    defineFilter: string
    cancel: string
  }
}

// Con la propiedad género se cambian las O por las A
const translations: Translations = {
  listOf: 'Listado de',
  new: 'Agregar nuevo',
  edit: 'Editar',
  add: 'Agregar',
  delete: 'Borrar',
  delExplanation:
    '¿Estás segure de borrar el {{name}}? Esta accion no se puede deshacer?',
  filter: 'Filtrar',
  filters: 'filtros',
  sort: 'Orgenar',
  open: 'Abrir',
  close: 'Cerrar',
  seeMore: 'Ver más',
  tooltips: {
    defineFilter: 'Definit TIPO de filtro',
    cancel: 'Cancelar',
  },
}

export const createTranslation = (props: Translations) => props
export default translations
