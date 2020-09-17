import * as Yup from 'yup'

export enum Tipos {
  Input,
  Numerico,
  Correo,
  Telefono,
  Multilinea,
  Opciones,
  Imagen,
  Autocomplete,
  Ubicacion,
  Switch,
  Multiple,
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
