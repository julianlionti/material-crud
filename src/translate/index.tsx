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
    greater: string
    lower: string
  }
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

export const createTranslation = (props: Translations) => props
