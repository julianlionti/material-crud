export interface Translations {
  listOf: string
  detailOf: string
  seeDetail: string
  pinToTop: string
  new: string
  edit: string
  add: string
  addItem: string
  delete: string
  crudCol: string
  delExplanation: (name: string) => string
  filters: string
  filter: string
  filterOptions: {
    startsWith: string
    equal: string
    different: string
    contains: string
    greater: string
    lower: string
  }
  sort: string
  open: string
  close: string
  seeMore: string
  noResults: string
  noOptions: string
  loading: string
  selected: string
  tooltips: {
    showPass: string
    hidePass: string
    defineFilter: string
    cancel: string
  }
  pagination?: {
    all: string
    rowsPerPage: string
    page: string
    showing: string
    of: string
  }
  inputs?: {
    image: { new: string; edit: string }
    file: { new: string; edit: string }
  }
  dialog?: { cancel: string; accept: string }
  serverError: string
  more: string
}

export const createTranslation = (props: Translations) => props
