import { ReactNode } from 'react'
import * as Yup from 'yup'

export enum FormTypes {
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
  Expandable,
  Secure,
  Date,
  Draggable,
}

export interface OpcionesProps {
  id: string
  title?: string
  extras?: object
}

export interface BaseProps {
  id: string
  title: string
}

export interface ComunesProps extends BaseProps {
  validate?: Yup.Schema<any>
  grow?: number
  help?: string
  loading?: boolean
  readonly?: boolean
  depends?: (props: any) => boolean
  hide?: boolean
  edit?: boolean
  filter?: boolean
}

export interface Interactions {
  filter?: string
  sort?: string
  page: string
  perPage: string
}
