import { createTranslation } from './index'

export const esAR = createTranslation({
  showCards: 'Cartas',
  listOf: 'Listado de',
  new: 'Nuev',
  edit: 'Editar',
  add: 'Agregar nuev',
  delete: 'Borrar',
  crudCol: 'Acciones',
  delExplanation: (name) =>
    `¿Estás seguro/a de borrar el ${name}? ¡Esta accion no se puede deshacer!`,
  filter: 'Filtrar',
  filterOptions: {
    startsWith: 'Empieza con',
    equal: 'Igual',
    different: 'Distinto',
    greater: 'Mayor',
    lower: 'Menor',
  },
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
    file: {
      new: 'Haga click en la Icono para subir un Archivo.',
      edit: 'Haga click en el archivo para editarlo.',
    },
  },
  dialog: {
    cancel: 'Cancelar',
    accept: 'Aceptar',
  },
})
