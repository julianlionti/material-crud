import React, { memo, useCallback, useMemo } from 'react'
import { Formik, FormikValues, FormikHelpers } from 'formik'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import * as Yup from 'yup'
import { Types, BaseProps } from './Types'
import AlCustom, { AlCustomProps } from './AlCustom'
import AlInput, { AlInputProps } from './AlInput'
import AlSelect, { AlSelectProps } from './AlSelect'
import AlImagen, { AlImagenProps } from './AlImagen'
import AlAutocomplete, { AlAutocompleteProps } from './AlAutocomplete'
import AlSwitch, { AlSwitchProps } from './AlSwitch'
import AlMultiple, { AlMultipleProps } from './AlMultiple'
import { generateDefault } from './helpers'

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
  | ({ type: Types.Expandable } & BaseProps)

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

export default memo((props: Props) => {
  const { fields, onSubmit, accept, loading, intials, noValidate } = props
  const classes = useClases()

  const renderInput = useCallback(
    (campo: TodosProps, values: any) => {
      if (campo.type === Types.Expandable) return null
      const { depends } = campo
      const hidden = depends && depends(values) === false
      switch (campo.type) {
        case Types.Input:
        case Types.Email:
        case Types.Multiline:
        case Types.Number:
        case Types.Phone:
          return <AlInput key={campo.id} {...campo} loading={loading} hide={hidden} />
        case Types.Options:
          return <AlSelect key={campo.id} {...campo} loading={loading} hide={hidden} />
        case Types.File:
        case Types.Image:
          return <AlImagen key={campo.id} {...campo} loading={loading} hide={hidden} />
        case Types.Autocomplete:
          return <AlAutocomplete key={campo.id} {...campo} loading={loading} hide={hidden} />
        case Types.Switch:
          return <AlSwitch key={campo.id} {...campo} loading={loading} hide={hidden} />
        case Types.Multiple:
          return <AlMultiple key={campo.id} {...campo} loading={loading} hide={hidden} />
        case Types.Custom:
          return <AlCustom key={campo.id} {...campo} loading={loading} hide={hidden} />
        default:
          return null
      }
    },
    [loading],
  )

  const valSchema = useMemo(
    () =>
      fields.flat().reduce((acc, it) => {
        if (it.type === Types.Expandable) return acc
        return { ...acc, [it.id]: it.validate }
      }, {}),
    [fields],
  )

  const defaultValues = useMemo(
    () => fields.flat().reduce((acc, it) => ({ ...acc, [it.id]: generateDefault(it) }), {}),
    [fields],
  )

  return (
    <Formik
      enableReinitialize
      initialValues={Object.keys(intials || {}).length > 0 ? intials : defaultValues}
      validationSchema={noValidate ? null : Yup.object().shape(valSchema)}
      onSubmit={(vals, helpers) => {
        if (onSubmit) onSubmit(vals, helpers)
      }}>
      {({ submitForm, values }) => (
        <div className={classes.container}>
          {fields.map((field, index) => {
            if (Array.isArray(field)) {
              return (
                <div key={`${field[0].id}-row-${index}`} className={classes.horizontal}>
                  {field.map((e) => renderInput(e, values))}
                </div>
              )
            }
            return renderInput(field, values)
          })}
          {accept && (
            <Button
              disabled={loading}
              onClick={submitForm}
              className={classes.btn}
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
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  btn: {
    marginTop: tema.spacing(2),
    marginBottom: tema.spacing(2),
    alignSelf: 'center',
  },
  horizontal: {
    display: 'flex',
    flex: 1,
  },
}))
