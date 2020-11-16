import { Moment } from 'moment'
import { Filter } from '../../utils/useFilters'
import { AllInputTypes, FormTypes } from './FormTypes'

export const multipleDefault = (conf: AllInputTypes[]) =>
  conf.flat().reduce((acc, it) => ({ ...acc, [it.id]: generateDefault(it) }), {})

export type DefResponse = boolean | null | '' | any[] | Filter | Moment
export const generateDefault = (item: AllInputTypes): DefResponse => {
  if (item.type === FormTypes.Expandable) return null
  if (item.type === FormTypes.OnlyTitle) return null
  if (item.filter) {
    switch (item.type) {
      case FormTypes.Autocomplete: {
        if (item.multiple) return { value: [], filter: 'contains' }
        else {
          return { value: null, filter: 'contains' }
        }
      }
      case FormTypes.Number: {
        return { value: '', filter: 'equal' }
      }
      case FormTypes.Switch: {
        return { value: false, filter: 'equal' }
      }
      case FormTypes.Multiline:
      case FormTypes.Email:
      case FormTypes.Phone:
      case FormTypes.Input:
        return { value: '', filter: 'contains' }
      default:
        return { value: '', filter: 'equal' }
    }
  }
  switch (item.type) {
    case FormTypes.Switch: {
      return false
    }
    case FormTypes.Autocomplete: {
      if (item.multiple) return []
      return null
    }
    case FormTypes.Multiple:
      return [multipleDefault(item.configuration)]
    case FormTypes.Image:
      return null
    case FormTypes.Date:
      return null
    case FormTypes.Options: {
      if (item.multiple) return []
      return ''
    }
    case FormTypes.Draggable:
      return []
    default:
      return ''
  }
}
