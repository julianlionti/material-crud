import { ReactNode } from 'react'
import * as Yup from 'yup'
import { ColumnProps } from '../Crud/CustomCell'

export enum Types {
  Input,
  Number,
  Email,
  Phone,
  Multiline,
  Options,
  Image,
  File,
  Autocomplete,
  Switch,
  Multiple,
  Custom,
}

export interface OpcionesProps {
  id: string
  title?: string
  extras?: object
}

export interface ComunesProps {
  id: string
  title: string
  validate?: Yup.Schema<any>
  grow?: number
  help?: string
  loading?: boolean
  readonly?: boolean
  depends?: (props: any) => boolean
  hide?: boolean
  list?: ColumnProps
  edit?: boolean
}

export interface Interactions {
  filter?: string
  sort?: string
  page: string
  perPage: string
}
