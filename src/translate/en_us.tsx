import { createTranslation } from '.'

export const enUS = createTranslation({
  showCards: 'Show cards',
  add: 'Add',
  close: 'Close',
  delExplanation: (name) => `You are going to delete ${name}!! Are you sure?!`,
  delete: 'Delete',
  edit: 'Edit',
  filter: 'Filter',
  filters: 'Filters',
  sort: 'Sort',
  listOf: 'List of',
  new: 'New',
  open: 'Open',
  seeMore: 'See more',
  crudCol: 'CRUD',
  loading: 'Loading...',
  noOptions: 'No options',
  tooltips: {
    cancel: 'Cancel',
    defineFilter: 'Define filter Type',
  },
  pagination: {
    rowsPerPage: 'Items per page',
    totalCount: 'Total Items',
  },
  inputs: {
    image: {
      new: 'Click on the camera to upload an image.',
      edit: 'Click on the image to edit it.',
    },
    file: {
      new: 'Click on the icon to upload a file.',
      edit: 'Click on the file to edit it.',
    },
  },
  dialog: {
    cancel: 'Cancel',
    accept: 'Accept',
  },
})
