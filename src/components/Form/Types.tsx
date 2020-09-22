import * as Yup from 'yup'

export enum Types {
  Input,
  Number,
  Email,
  Phone,
  Multiline,
  Options,
  Image,
  Autocomplete,
  // Ubicacion,
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
  filter?: boolean
  sort?: boolean
  readonly?: boolean
  depends?: (props: any) => boolean
  hide?: boolean
}
