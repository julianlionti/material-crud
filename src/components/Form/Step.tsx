import React, { forwardRef, memo, useCallback, useMemo } from 'react'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import { Formik, FormikHelpers, FormikProps } from 'formik'
import { serialize } from 'object-to-formdata'
import * as Yup from 'yup'
import { FormProps } from '.'
import AlAutocomplete from './AlAutocomplete'
import AlCustom from './AlCustom'
import AlDate from './AlDate'
import AlDropFiles from './AlDropFiles'
import AlImagen from './AlImagen'
import AlInput from './AlInput'
import AlMultiple from './AlMultiple'
import AlOnlyTitle from './AlOnlyTitle'
import AlSelect from './AlSelect'
import AlSwitch from './AlSwitch'
import { AllInputTypes, FieldProps, FormTypes } from './FormTypes'
import { generateDefault } from './helpers'

interface Props extends Omit<FormProps, 'steps'> {
  fields: FieldProps[]
  noFilterOptions?: boolean
}

export default memo(
  forwardRef<FormikProps<any>, Props>((props, ref) => {
    const {
      fields,
      onSubmit,
      accept,
      loading,
      intials,
      noValidate,
      inline,
      isFormData,
      noFilterOptions,
    } = props
    const classes = useClases({ inline })
    const isEditing = useMemo(() => Object.keys(intials || {}).length > 0, [intials])

    const finalFields = useMemo(
      () =>
        fields
          .map((e) => {
            if (Array.isArray(e)) {
              return e.filter((i) => {
                if (i.type === FormTypes.Expandable) return true
                if (i.type === FormTypes.OnlyTitle) return true

                if (i.new === false && !isEditing) return false
                if (i.edit === false && isEditing) return false
                return true
              })
            }
            return e
          })
          .filter((e) => {
            if (Array.isArray(e)) {
              return true
            }
            if (e.type === FormTypes.Expandable) return true
            if (e.type === FormTypes.OnlyTitle) return true
            if (e.new === false && !isEditing) return false
            if (e.edit === false && isEditing) return false
            return true
          }),
      [isEditing, fields],
    )
    console.log(isEditing, intials)
    const renderInput = useCallback(
      (campo: AllInputTypes, values: any) => {
        if (campo.type === FormTypes.Expandable) return null
        if (campo.type === FormTypes.OnlyTitle) return <AlOnlyTitle key={campo.id} {...campo} />

        const { depends } = campo
        const hidden = depends && depends(values) === false
        switch (campo.type) {
          case FormTypes.Input:
          case FormTypes.Email:
          case FormTypes.Multiline:
          case FormTypes.Number:
          case FormTypes.Secure:
          case FormTypes.Phone:
            return (
              <AlInput
                key={campo.id}
                {...campo}
                loading={loading}
                hide={hidden}
                isEditing={isEditing}
                noFilterOptions={noFilterOptions}
              />
            )
          case FormTypes.Options:
            return (
              <AlSelect
                key={campo.id}
                {...campo}
                loading={loading}
                hide={hidden}
                noFilterOptions={noFilterOptions}
                isEditing={isEditing}
              />
            )
          case FormTypes.File:
          case FormTypes.Image:
            return (
              <AlImagen
                key={campo.id}
                {...campo}
                loading={loading}
                hide={hidden}
                noFilterOptions={noFilterOptions}
              />
            )
          case FormTypes.Autocomplete:
            return (
              <AlAutocomplete
                key={campo.id}
                {...campo}
                loading={loading}
                hide={hidden}
                noFilterOptions={noFilterOptions}
              />
            )
          case FormTypes.Switch:
            return (
              <AlSwitch
                key={campo.id}
                {...campo}
                loading={loading}
                hide={hidden}
                noFilterOptions={noFilterOptions}
              />
            )
          case FormTypes.Multiple:
            return (
              <AlMultiple
                key={campo.id}
                {...campo}
                loading={loading}
                hide={hidden}
                noFilterOptions={noFilterOptions}
              />
            )
          case FormTypes.Custom:
            return (
              <AlCustom
                key={campo.id}
                {...campo}
                loading={loading}
                hide={hidden}
                noFilterOptions={noFilterOptions}
              />
            )
          case FormTypes.Date:
            return (
              <AlDate
                key={campo.id}
                {...campo}
                loading={loading}
                hide={hidden}
                noFilterOptions={noFilterOptions}
              />
            )
          case FormTypes.Draggable:
            return (
              <AlDropFiles
                key={campo.id}
                {...campo}
                loading={loading}
                hide={hidden}
                noFilterOptions={noFilterOptions}
              />
            )
          default:
            return null
        }
      },
      [loading, noFilterOptions, isEditing],
    )

    const valSchema = useMemo(
      () =>
        finalFields.flat().reduce((acc, it) => {
          if (it.type === FormTypes.Expandable || it.type === FormTypes.OnlyTitle) return acc
          else return { ...acc, [it.id]: it.validate }
        }, {}),
      [finalFields],
    )

    const defaultValues = useMemo(
      () =>
        finalFields
          .flat()
          .filter((e) => e.type !== FormTypes.Expandable && e.type !== FormTypes.OnlyTitle)
          .reduce((acc, it) => ({ ...acc, [it.id]: generateDefault(it) }), {}),
      [finalFields],
    )

    const onSubmitCall = useCallback(
      (vals: any, helpers: FormikHelpers<any>) => {
        let finalData = vals
        if (isFormData)
          finalData = serialize(vals, {
            indices: true,
            allowEmptyArrays: true,
          })

        if (onSubmit) onSubmit(finalData, helpers)
      },
      [isFormData, onSubmit],
    )

    const renderFields = useCallback(
      ({ submitForm, values }: { submitForm: () => Promise<any>; values: any }) => {
        return (
          <div className={classes.root}>
            <div className={classes.fieldsRoot}>
              {finalFields.map((field, index) => {
                if (Array.isArray(field)) {
                  return (
                    <div key={`${field[0].id}-row-${index}`} className={classes.horizontal}>
                      {field.map((e) => renderInput(e, values))}
                    </div>
                  )
                }
                return renderInput(field, values)
              })}
            </div>
            {accept && (
              <Button
                size={inline ? 'small' : 'medium'}
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
        )
      },
      [accept, classes, finalFields, inline, loading, renderInput],
    )

    return (
      <Formik
        innerRef={ref}
        enableReinitialize
        initialValues={isEditing ? intials : defaultValues}
        validationSchema={noValidate ? null : Yup.object().shape(valSchema)}
        onSubmit={onSubmitCall}>
        {renderFields}
      </Formik>
    )
  }),
)

const useClases = makeStyles((tema) => ({
  root: ({ inline }: any) => ({
    flex: 1,
    display: 'flex',
    flexDirection: inline ? 'row' : 'column',
    alignItems: inline ? 'center' : undefined,
  }),
  fieldsRoot: ({ inline }: any) => ({
    alignItems: inline ? 'start' : undefined,
    flex: 1,
    display: 'flex',
    flexDirection: inline ? 'row' : 'column',
  }),
  btn: {
    marginTop: tema.spacing(2),
    marginBottom: tema.spacing(2),
    alignSelf: 'center',
  },
  horizontal: ({ inline }: any) => ({
    display: 'flex',
    flexDirection: inline ? 'column' : 'row',
    flex: 1,
  }),
}))
