import { createTranslation } from './index'

export const esAR = createTranslation({
  listOf: 'Listado de',
  detailOf: 'Detalle de',
  download: 'Descargar',
  share: 'Compartir',
  seeDetail: 'Ver detalle',
  pinToTop: 'Mantener arriba',
  add: 'Agregar nuev',
  addItem: 'Agregar item',
  new: 'Nuev',
  edit: 'Editar',
  delete: 'Borrar',
  crudCol: 'Acciones',
  selected: 'seleccionados',
  delExplanation: (name) =>
    `¿Estás seguro/a de borrar el ${name}? ¡Esta accion no se puede deshacer!`,
  filter: 'Filtrar',
  filterOptions: {
    startsWith: 'Empieza con',
    equal: 'Igual',
    different: 'Distinto',
    contains: 'Contiene',
    greater: 'Mayor',
    lower: 'Menor',
  },
  open: 'Abrir',
  close: 'Cerrar',
  filters: 'filtros',
  sort: 'Orgenar',
  seeMore: 'Ver más',
  noOptions: 'Sin opciones',
  noResults: 'No se encontraron resultados',
  loading: 'Cargando...',
  tooltips: {
    showPass: 'Mostrar contraseña',
    hidePass: 'Ocultar contraseña',
    defineFilter: 'Definit TIPO de filtro',
    cancel: 'Cancelar',
  },
  pagination: {
    all: 'Todos',
    rowsPerPage: 'Filas por página',
    totalCount: 'Cantidad de items',
    page: 'Página',
  },
  inputs: {
    image: {
      new: 'Haga click en la camara para subir una imagen.',
      edit: 'Haga click en la imagen para editarla.',
    },
    file: {
      new: 'Haga click en la Icono para subir un Archivo.',
      edit: 'Haga click ACA para editarlo.',
    },
  },
  dialog: {
    cancel: 'Cancelar',
    accept: 'Aceptar',
  },
  serverError: 'Error en el servidor',
  more: 'Más opciones',
})
