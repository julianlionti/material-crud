import React, { memo, useCallback, useMemo } from 'react'
import { Formik, FormikValues, FormikHelpers } from 'formik'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import * as Yup from 'yup'
import AlInput, { AlInputProps } from './AlInput'
import AlSelect, { AlSelectProps } from './AlSelect'
import AlImagen, { AlImagenProps } from './AlImagen'
import AlAutocomplete, { AlAutocompleteProps } from './AlAutocomplete'
import AlSwitch, { AlSwitchProps } from './AlSwitch'
import AlMultiple, { AlMultipleProps, valDefault } from './AlMultiple'
import { Types } from './Types'
import AlCustom, { AlCustomProps } from './AlCustom'

Yup.setLocale({
  string: {
    max: ({ path, max }) => `${path} debe contener ${max} caracteres máximo`,
  },
  mixed: {
    required: ({ path }) => `El ${path} es obligatorio`,
  },
})

export type TodosProps =
  | AlInputProps
  | AlSelectProps
  | AlImagenProps
  | AlAutocompleteProps
  | AlSwitchProps
  | AlMultipleProps
  | AlCustomProps

export type CamposProps = TodosProps | TodosProps[]

export interface Props {
  fields: CamposProps[]
  onSubmit?: (values: FormikValues, helpers: FormikHelpers<any>) => void | Promise<any>
  accept?: string
  loading?: boolean
  intials?: any
  noValidate?: boolean
}

export const createFields = (props: () => CamposProps[]) => props()

export const generarDefault = (item: TodosProps): any => {
  if (item.filter) {
    if (item.type === Types.Autocomplete) {
      if (item.multiple) return []
      else {
        return { valor: [], filtro: 'igual' }
      }
    }
    if (item.type === Types.Number) {
      return { valor: '', filtro: 'igual' }
    }
    return { valor: '', filtro: 'empiezaCon' }
  }
  switch (item.type) {
    case Types.Switch: {
      return false
    }
    case Types.Autocomplete: {
      if (item.multiple) return []
      return null
    }
    case Types.Multiple:
      return [valDefault(item.configuration)]
    case Types.Image:
      return null
    default:
      return ''
  }
}

export default memo((props: Props) => {
  const { fields, onSubmit, accept, loading, intials, noValidate } = props
  const clases = useClases()

  const renderInput = useCallback(
    (campo: TodosProps, valores: any) => {
      const { depends } = campo
      const ocultar = depends && depends(valores) === false

      switch (campo.type) {
        case Types.Input:
        case Types.Email:
        case Types.Multiline:
        case Types.Number:
        case Types.Phone:
          return <AlInput key={campo.id} {...campo} loading={loading} hide={ocultar} />
        case Types.Options:
          return <AlSelect key={campo.id} {...campo} loading={loading} hide={ocultar} />
        case Types.Image:
          return <AlImagen key={campo.id} {...campo} loading={loading} />
        case Types.Autocomplete:
          return <AlAutocomplete key={campo.id} {...campo} loading={loading} />
        case Types.Switch:
          return <AlSwitch key={campo.id} {...campo} loading={loading} />
        case Types.Multiple:
          return <AlMultiple key={campo.id} {...campo} loading={loading} hide={ocultar} />
        case Types.Custom:
          return <AlCustom key={campo.id} {...campo} loading={loading} />
        default:
          return null
      }
    },
    [loading],
  )

  const valSchema = useMemo(
    () => fields.flat().reduce((acc, it) => ({ ...acc, [it.id]: it.validate }), {}),
    [fields],
  )

  const porDefecto = useMemo(
    () =>
      fields.flat().reduce((acc, it) => ({ ...acc, [it.id]: generarDefault(it) }), {}),
    [fields],
  )

  return (
    <Formik
      // enableReinitialize={!onSubmit}
      enableReinitialize
      initialValues={Object.keys(intials || {}).length > 0 ? intials : porDefecto}
      validationSchema={noValidate ? null : Yup.object().shape(valSchema)}
      onSubmit={(vals, helpers) => {
        if (onSubmit) onSubmit(vals, helpers)
      }}>
      {({ submitForm, values }) => (
        <div className={clases.contenedor}>
          {fields.map((campo, index) => {
            if (Array.isArray(campo)) {
              return (
                <div key={`${campo[0].id}-row-${index}`} className={clases.horizontal}>
                  {campo.map((e) => renderInput(e, values))}
                </div>
              )
            }
            return renderInput(campo, values)
          })}
          {accept && (
            <Button
              disabled={loading}
              onClick={submitForm}
              className={clases.boton}
              color="primary"
              endIcon={loading && <CircularProgress size={16} />}
              variant="outlined">
              {accept}
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
