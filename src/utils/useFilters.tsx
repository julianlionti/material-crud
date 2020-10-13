import React, { ReactNode, useMemo } from 'react'
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

  const contains = useMemo<FilterMenu>(
    () => ({
      id: 'contains',
      text: lang.filterOptions!!.contains,
      icon: <FaInbox size={defIconSize} />,
    }),
    [lang],
  )

  const startsWith = useMemo<FilterMenu>(
    () => ({
      id: 'startsWith',
      text: lang.filterOptions!!.startsWith,
      icon: <FaArrowRight size={defIconSize} />,
    }),
    [lang],
  )

  const equal = useMemo<FilterMenu>(
    () => ({
      id: 'equal',
      text: lang.filterOptions!!.equal,
      icon: <FaEquals size={defIconSize} />,
    }),
    [lang],
  )

  const different = useMemo<FilterMenu>(
    () => ({
      id: 'different',
      text: lang.filterOptions!!.different,
      icon: <FaNotEqual size={defIconSize} />,
    }),
    [lang],
  )

  const greater = useMemo<FilterMenu>(
    () => ({
      id: 'greater',
      text: lang.filterOptions!!.greater,
      icon: <FaChevronRight size={defIconSize} />,
    }),
    [lang],
  )

  const lower = useMemo<FilterMenu>(
    () => ({
      id: 'lower',
      text: lang.filterOptions!!.lower,
      icon: <FaChevronLeft size={defIconSize} />,
    }),
    [lang],
  )

  return {
    text: [contains, startsWith, equal, different],
    numeric: [equal, greater, lower],
    autocomplete: [contains, equal, different],
    select: [equal, different],
  }
}
