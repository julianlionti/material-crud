import React, { memo, useCallback, useMemo } from 'react'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import { Formik, FormikValues, FormikHelpers } from 'formik'
import { serialize } from 'object-to-formdata'
import * as Yup from 'yup'
import AlAutocomplete, { AlAutocompleteProps } from './AlAutocomplete'
import AlCustom, { AlCustomProps } from './AlCustom'
import AlDate, { AlDateProps } from './AlDate'
import AlDropFiles, { AlDropFilesProps } from './AlDropFiles'
import AlImagen, { AlImagenProps } from './AlImagen'
import AlInput, { AlInputProps } from './AlInput'
import AlMultiple, { AlMultipleProps } from './AlMultiple'
import AlSelect, { AlSelectProps } from './AlSelect'
import AlSwitch, { AlSwitchProps } from './AlSwitch'
import { FormTypes, BaseProps } from './FormTypes'
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
  | AlDateProps
  | AlDropFilesProps
  | ({ type: FormTypes.Expandable } & BaseProps)

export type CamposProps = TodosProps | TodosProps[]

export interface Props {
  fields: CamposProps[]
  onSubmit?: (values: FormikValues, helpers: FormikHelpers<any>) => void | Promise<any>
  accept?: string
  loading?: boolean
  intials?: any
  noValidate?: boolean
  inline?: boolean
  isFormData?: boolean
}

export const createFields = (props: CamposProps[]) => props // (props: () => CamposProps[]) => props()

export default memo((props: Props) => {
  const { fields, onSubmit, accept, loading, intials, noValidate, inline, isFormData } = props
  const classes = useClases({ inline })

  const renderInput = useCallback(
    (campo: TodosProps, values: any) => {
      if (campo.type === FormTypes.Expandable) return null
      const { depends } = campo
      const hidden = depends && depends(values) === false
      switch (campo.type) {
        case FormTypes.Input:
        case FormTypes.Email:
        case FormTypes.Multiline:
        case FormTypes.Number:
        case FormTypes.Secure:
        case FormTypes.Phone:
          return <AlInput key={campo.id} {...campo} loading={loading} hide={hidden} />
        case FormTypes.Options:
          return <AlSelect key={campo.id} {...campo} loading={loading} hide={hidden} />
        case FormTypes.File:
        case FormTypes.Image:
          return <AlImagen key={campo.id} {...campo} loading={loading} hide={hidden} />
        case FormTypes.Autocomplete:
          return <AlAutocomplete key={campo.id} {...campo} loading={loading} hide={hidden} />
        case FormTypes.Switch:
          return <AlSwitch key={campo.id} {...campo} loading={loading} hide={hidden} />
        case FormTypes.Multiple:
          return <AlMultiple key={campo.id} {...campo} loading={loading} hide={hidden} />
        case FormTypes.Custom:
          return <AlCustom key={campo.id} {...campo} loading={loading} hide={hidden} />
        case FormTypes.Date:
          return <AlDate key={campo.id} {...campo} loading={loading} hide={hidden} />
        case FormTypes.Draggable:
          return <AlDropFiles key={campo.id} {...campo} loading={loading} hide={hidden} />
        default:
          return null
      }
    },
    [loading],
  )

  const valSchema = useMemo(
    () =>
      fields.flat().reduce((acc, it) => {
        if (it.type === FormTypes.Expandable) return acc
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
        let finalData = vals
        if (isFormData)
          finalData = serialize(vals, {
            indices: true,
            allowEmptyArrays: true,
          })

        if (onSubmit) onSubmit(finalData, helpers)
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
  container: ({ inline }: any) => ({
    flex: 1,
    display: 'flex',
    flexDirection: inline ? 'row' : 'column',
  }),
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
