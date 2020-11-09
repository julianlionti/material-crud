import { ReactNode } from 'react'

interface CellComponentProps {
  rowData: any
  expandRow: () => void
  isExpanded: boolean
}

interface CommonProps {
  id: string
  title: string
  width?: number
  align?: 'flex-start' | 'center' | 'flex-end'
  cellComponent?: (props: CellComponentProps) => ReactNode
  sort?: boolean
}

interface NumberType extends CommonProps {
  type: TableTypes.Number
}

interface StringType extends CommonProps {
  type?: TableTypes.String
}

interface DateType extends CommonProps {
  type: TableTypes.Date
  format?: string
}

interface SwtichType extends CommonProps {
  type: TableTypes.Switch
}

interface CustomType extends CommonProps {
  type: TableTypes.Custom
  height?: number
  content: (rowData: any) => ReactNode
}

interface ImageType extends CommonProps {
  type: TableTypes.Image
  baseURL: string
}

export enum TableTypes {
  String,
  Number,
  Date,
  Switch,
  Custom,
  Image,
}

export interface ActionProps {
  // new?: boolean
  edit?: boolean
  delete?: boolean
}

export type ColumnsProps = StringType | DateType | SwtichType | CustomType | ImageType | NumberType
export interface RightToolbarProps {
  rowsSelected: any[]
  list: any[]
  deleteCall: (id: any) => void
  editCall: (id: any, item: any) => void
  clearSelected: () => void
}

/* Las propiedades configurables de la tabla */
export interface TableProps {
  height?: number
  headerHeight?: number
  rowHeight?: number
  actions?: ActionProps
  extraActions?: ReactNode[]
  showSelecting?: boolean
  rightToolbar?: (props: RightToolbarProps) => ReactNode
  loading?: boolean
}
