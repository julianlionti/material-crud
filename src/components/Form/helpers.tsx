import { TodosProps } from '.'
import { Filter } from '../../utils/useFilters'
import { Types } from './Types'

export const multipleDefault = (conf: TodosProps[]) =>
  conf.flat().reduce((acc, it) => ({ ...acc, [it.id]: generateDefault(it) }), {})

export type DefResponse = boolean | null | '' | any[] | Filter
export const generateDefault = (item: TodosProps): DefResponse => {
  if (item.list?.filter) {
    switch (item.type) {
      case Types.Autocomplete: {
        if (item.multiple) return { value: [], filter: 'contains' }
        else {
          return { value: null, filter: 'contains' }
        }
      }
      case Types.Number: {
        return { value: '', filter: 'equal' }
      }
      case Types.Switch: {
        return { value: false, filter: 'equal' }
      }
      default:
        return { value: '', filter: 'equal' }
    }
  }
  switch (item.type) {
    case Types.Switch: {
      return false
    }
    case Types.Autocomplete: {
      if (item.multiple) return []
      return null
    }
    case Types.Multiple:
      return [multipleDefault(item.configuration)]
    case Types.Image:
      return null
    default:
      return ''
  }
}