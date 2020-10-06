import React, { ReactNode } from 'react'
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaEquals,
  FaInbox,
  FaNotEqual,
} from 'react-icons/fa'
import { useLang } from './CrudContext'

export type FilterTypes =
  | 'startsWith'
  | 'equal'
  | 'different'
  | 'contains'
  | 'id'
  | 'array'
  | 'custom'
  | 'greater'
  | 'lower'

export interface Filter<T = any> {
  value: T
  filter: FilterTypes
}

export interface FilterMenu {
  id: FilterTypes
  text: string
  icon: ReactNode
}

export interface FilterResponse {
  text?: FilterMenu[]
  numeric?: FilterMenu[]
  autocomplete?: FilterMenu[]
  select?: FilterMenu[]
}

const defIconSize = 16
export default (): FilterResponse => {
  const lang = useLang()
  return {
    text: [
      {
        id: 'startsWith',
        text: lang?.filterOptions?.startsWith || 'Starts with',
        icon: <FaArrowRight size={defIconSize} />,
      },
      {
        id: 'equal',
        text: lang?.filterOptions?.equal || 'Equal',
        icon: <FaEquals size={defIconSize} />,
      },
      {
        id: 'different',
        text: lang?.filterOptions?.different || 'Different',
        icon: <FaNotEqual size={defIconSize} />,
      },
    ],
    numeric: [
      {
        id: 'equal',
        text: lang?.filterOptions?.equal || 'Equal',
        icon: <FaEquals size={defIconSize} />,
      },
      {
        id: 'greater',
        text: lang?.filterOptions?.greater || 'Greater',
        icon: <FaChevronRight size={defIconSize} />,
      },
      {
        id: 'lower',
        text: lang?.filterOptions?.lower || 'Lower',
        icon: <FaChevronLeft size={defIconSize} />,
      },
    ],
    autocomplete: [
      {
        id: 'contains',
        text: lang?.filterOptions?.equal || 'Contains',
        icon: <FaInbox size={defIconSize} />,
      },
      {
        id: 'different',
        text: lang?.filterOptions?.different || 'Different',
        icon: <FaNotEqual size={defIconSize} />,
      },
    ],
    select: [
      {
        id: 'equal',
        text: lang?.filterOptions?.equal || 'Equal',
        icon: <FaEquals size={defIconSize} />,
      },
      {
        id: 'different',
        text: lang?.filterOptions?.different || 'Different',
        icon: <FaNotEqual size={defIconSize} />,
      },
    ],
  }
}
