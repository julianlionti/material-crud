import { createTranslation } from '.'

export const enUS = createTranslation({
  listOf: 'List of',
  add: 'Add',
  addItem: 'Add item',
  new: 'New',
  edit: 'Edit',
  delete: 'Delete',
  crudCol: 'CRUD',
  selected: 'selected',
  delExplanation: (name) => `You are going to delete ${name}!! Are you sure?!`,
  filter: 'Filter',
  filterOptions: {
    startsWith: 'Starts With',
    equal: 'Equal',
    different: 'Different',
    contains: 'Contains',
    greater: 'Greater',
    lower: 'Lower',
  },
  open: 'Open',
  close: 'Close',
  filters: 'Filters',
  sort: 'Sort',
  seeMore: 'See more',
  noOptions: 'No options',
  noResults: 'No results',
  loading: 'Loading...',
  tooltips: {
    showPass: 'Mostrar contraseña',
    hidePass: 'Ocultar contraseña',
    defineFilter: 'Define filter Type',
    cancel: 'Cancel',
  },
  pagination: {
    all: 'All',
    rowsPerPage: 'Items per page',
    totalCount: 'Total Items',
    page: 'Page',
  },
  inputs: {
    image: {
      new: 'Click on the camera to upload an image.',
      edit: 'Click on the image to edit it.',
    },
    file: {
      new: 'Click on the icon to upload a file.',
      edit: 'Click on HERE to edit it.',
    },
  },
  dialog: {
    cancel: 'Cancel',
    accept: 'Accept',
  },
  serverError: 'Server error',
  more: 'More options',
})
