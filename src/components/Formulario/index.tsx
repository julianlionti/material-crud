import React, { memo, useCallback, useMemo } from 'react'
import { Formik, FormikValues, FormikHelpers } from 'formik'
import { makeStyles, Button, CircularProgress } from '@material-ui/core'
import * as Yup from 'yup'
import AlInput, { AlInputProps } from './AlInput'
import AlSelect, { AlSelectProps } from './AlSelect'
import AlImagen, { AlImagenProps } from './AlImagen'
import AlUbicacion, { AlUbicacionProps } from './AlUbicacion'
import AlAutocomplete, { AlAutocompleteProps } from './AlAutocomplete'
import AlSwitch, { AlSwitchProps } from './AlSwitch'
import AlMultiple, { AlMultipleProps } from './AlMultiple'

Yup.setLocale({
  string: {
    max: ({ path, max }) => `${path} debe contener ${max} caracteres máximo`,
  },
  mixed: {
    required: ({ path }) => `El ${path} es obligatorio`,
  },
})

export interface OpcionesProps {
  id: string
  titulo?: string
  extras?: object
}

export interface ComunesProps {
  id: string
  titulo: string
  validar?: Yup.Schema<any>
  grow?: number
  ayuda?: string
  cargando?: boolean
  filtrar?: boolean
  ordenar?: boolean
  soloLectura?: boolean
  depende?: (props: any) => boolean
  ocultar?: boolean
}

export enum Tipos {
  Input = 0,
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

export type TodosProps =
  | AlInputProps
  | AlSelectProps
  | AlImagenProps
  | AlAutocompleteProps
  | AlUbicacionProps
  | AlSwitchProps
  | AlMultipleProps

export type CamposProps = TodosProps | TodosProps[]

interface Props {
  campos: CamposProps[]
  onSubmit?: (values: FormikValues, helpers: FormikHelpers<any>) => void | Promise<any>
  aceptar?: string
  cargando?: boolean
  iniciales?: any
  sinValidar?: boolean
}

export const crearCampos = (props: () => CamposProps[]) => props()

const generarDefault = (item: TodosProps) => {
  if (item.filtrar) {
    if (item.tipo === Tipos.Autocomplete) {
      if (item.multiple) return []
      else {
        return { valor: [], filtro: 'igual' }
      }
    }
    if (item.tipo === Tipos.Numerico) {
      return { valor: '', filtro: 'igual' }
    }
    return { valor: '', filtro: 'empiezaCon' }
  }
  switch (item.tipo) {
    case Tipos.Switch: {
      return false
    }
    case Tipos.Autocomplete: {
      if (item.multiple) return []
      return null
    }
    case Tipos.Ubicacion: {
      return { lat: '', lng: '', provincia: '', localidad: '' }
    }
    case Tipos.Multiple:
      return [
        Object.keys(item.configuration).reduce(
          (acc, it) => ({
            ...acc,
            [it]: '',
          }),
          {},
        ),
      ]
    case Tipos.Imagen:
      return null
    default:
      return ''
  }
}

export default memo((props: Props) => {
  const { campos, onSubmit, aceptar, cargando, iniciales, sinValidar } = props
  const clases = useClases()

  const renderInput = useCallback(
    (campo: TodosProps, valores: any) => {
      const { depende } = campo
      const ocultar = depende && depende(valores) === false

      switch (campo.tipo) {
        case Tipos.Input:
        case Tipos.Correo:
        case Tipos.Multilinea:
        case Tipos.Numerico:
        case Tipos.Telefono:
          return (
            <AlInput key={campo.id} {...campo} cargando={cargando} ocultar={ocultar} />
          )
        case Tipos.Opciones:
          return (
            <AlSelect key={campo.id} {...campo} cargando={cargando} ocultar={ocultar} />
          )
        case Tipos.Imagen:
          return <AlImagen key={campo.id} {...campo} cargando={cargando} />
        case Tipos.Autocomplete:
          return <AlAutocomplete key={campo.id} {...campo} cargando={cargando} />
        case Tipos.Ubicacion:
          return <AlUbicacion key={campo.id} {...campo} cargando={cargando} />
        case Tipos.Switch:
          return <AlSwitch key={campo.id} {...campo} cargando={cargando} />
        case Tipos.Multiple:
          return <AlMultiple key={campo.id} {...campo} cargando={cargando} />
        default:
          return null
      }
    },
    [cargando],
  )

  const valSchema = useMemo(
    () => campos.flat().reduce((acc, it) => ({ ...acc, [it.id]: it.validar }), {}),
    [campos],
  )

  const porDefecto = useMemo(
    () =>
      campos.flat().reduce((acc, it) => ({ ...acc, [it.id]: generarDefault(it) }), {}),
    [campos],
  )

  return (
    <Formik
      enableReinitialize={!onSubmit}
      initialValues={Object.keys(iniciales || {}).length > 0 ? iniciales : porDefecto}
      validationSchema={sinValidar ? null : Yup.object().shape(valSchema)}
      onSubmit={(vals, helpers) => {
        if (onSubmit) onSubmit(vals, helpers)
      }}>
      {({ submitForm, values }) => (
        <div className={clases.contenedor}>
          {campos.map((campo) => {
            if (Array.isArray(campo)) {
              return (
                <div key={`${campo[0].id}-row`} className={clases.horizontal}>
                  {campo.map((e) => renderInput(e, values))}
                </div>
              )
            }
            return renderInput(campo, values)
          })}
          {aceptar && (
            <Button
              disabled={cargando}
              onClick={submitForm}
              className={clases.boton}
              color="primary"
              endIcon={cargando && <CircularProgress size={16} />}
              variant="outlined">
              {aceptar}
            </Button>
          )}
        </div>
      )}
    </Formik>
  )
})

const useClases = makeStyles((tema) => ({
  contenedor: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  boton: {
    marginTop: tema.spacing(2),
    marginBottom: tema.spacing(2),
    alignSelf: 'center',
  },
  horizontal: {
    display: 'flex',
    flex: 1,
  },
}))
