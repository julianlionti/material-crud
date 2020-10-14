import { TodosProps } from '.'
import { Filter } from '../../utils/useFilters'
import { Types } from './Types'
import moment, { Moment } from 'moment'

export const multipleDefault = (conf: TodosProps[]) =>
  conf.flat().reduce((acc, it) => ({ ...acc, [it.id]: generateDefault(it) }), {})

export type DefResponse = boolean | null | '' | any[] | Filter | Moment
export const generateDefault = (item: TodosProps): DefResponse => {
  if (item.type === Types.Expandable) return null
  if (item.filter) {
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
      case Types.Multiline:
      case Types.Email:
      case Types.Phone:
      case Types.Input:
        return { value: '', filter: 'contains' }
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
    case Types.Date:
      return moment()
    default:
      return ''
  }
}
