export interface Translations {
  showCards: string
  listOf: string
  new: string
  edit: string
  add: string
  delete: string
  crudCol: string
  delExplanation: (name: string) => string
  filters: string
  filter: string
  filterOptions?: {
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
    defineFilter: string
    cancel: string
  }
  pagination?: {
    rowsPerPage: string
    totalCount: string
    page: string
  }
  inputs?: {
    image: { new: string; edit: string }
    file: { new: string; edit: string }
  }
  dialog?: { cancel: string; accept: string }
}

export const createTranslation = (props: Translations) => props
