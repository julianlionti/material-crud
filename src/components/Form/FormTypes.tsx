import * as Yup from 'yup'
import { AlAutocompleteProps } from './AlAutocomplete'
import { AlCustomProps } from './AlCustom'
import { AlDateProps } from './AlDate'
import { AlDropFilesProps } from './AlDropFiles'
import { AlImagenProps } from './AlImagen'
import { AlInputProps } from './AlInput'
import { AlMultipleProps } from './AlMultiple'
import { AlOnlyTitleProps } from './AlOnlyTitle'
import { AlSelectProps } from './AlSelect'
import { AlSwitchProps } from './AlSwitch'

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
  OnlyTitle,
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

export interface AlExpandableProps extends BaseProps {
  type: FormTypes.Expandable
}

export type AllInputTypes =
  | AlInputProps
  | AlSelectProps
  | AlImagenProps
  | AlAutocompleteProps
  | AlSwitchProps
  | AlMultipleProps
  | AlCustomProps
  | AlDateProps
  | AlDropFilesProps
  | AlExpandableProps
  | AlOnlyTitleProps

export type FieldProps = AllInputTypes | AllInputTypes[]

export interface StepProps {
  id: string
  title: string
  fields: FieldProps[]
}
