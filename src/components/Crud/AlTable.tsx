import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import {} from 'react-window'

export interface ColumnProps {
  id: string
  title: string
  numeric?: boolean
  width: number
}

interface Row {
  index: number
}

export interface TableProps {
  columns: ColumnProps[]
  rows: (row: Row) => any
  headerHeight?: number
  onRowClick?: () => void
  rowCount: number
  rowHeight?: number
}

export default ({}: TableProps) => {
  return <AutoSizer>{({ height, width }) => <span>asd</span>}</AutoSizer>
}
