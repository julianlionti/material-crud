import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Button, CircularProgress, makeStyles, Tab, Tabs, Typography } from '@material-ui/core'
import { FormikValues, FormikHelpers, FormikProps } from 'formik'
import { FaCheck, FaTimes } from 'react-icons/fa'
import SwipeableViews from 'react-swipeable-views'
import * as Yup from 'yup'
import { compareKeys } from '../../utils/addOns'
import { StepProps, FieldProps } from './FormTypes'
import { generateDefault } from './helpers'
import Step from './Step'

Yup.setLocale({
  string: {
    max: ({ path, max }) => `${path} debe contener ${max} caracteres máximo`,
  },
  mixed: {
    required: ({ path }) => `El campo '${path}' es obligatorio`,
  },
})

export interface FormProps {
  steps?: StepProps[]
  fields?: FieldProps[]
  onSubmit?: (values: FormikValues, helpers?: FormikHelpers<any>) => void | Promise<any>
  accept?: string
  loading?: boolean
  intials?: any
  noValidate?: boolean
  inline?: boolean
  isFormData?: boolean
  noFilterOptions?: boolean
  showHelpIcon?: boolean
  isEditing?: boolean
}

export const createFields = (props: (FieldProps | undefined | false)[]) =>
  props.filter((e) => e) as FieldProps[]

export const createSteps = (props: StepProps[]) => props

interface RefProps {
  form: FormikProps<any>
  id: string
}
export default memo((props: FormProps) => {
  const hasSubmitedRef = useRef(false)
  const formRef = useRef<RefProps[]>([])
  const [formsValues, setFormsValues] = useState({})
  const {
    fields,
    steps,
    loading,
    isFormData,
    accept,
    onSubmit,
    noFilterOptions,
    intials,
    showHelpIcon,
    isEditing,
  } = props

  const [tab, setTab] = useState(0)

  const classes = useClasses()

  const renderIntials = useCallback(
    (arrayFields: FieldProps[]) => {
      if (arrayFields) {
        const finalIntials = arrayFields.flat().reduce((acc, actual) => {
          if (!intials || !intials[actual.id]) {
            if (actual.defaultValue) {
              return { ...acc, [actual.id]: actual.defaultValue }
            }
            // return acc
            return { ...acc, [actual.id]: generateDefault(actual) }
          }
          return { ...acc, [actual.id]: intials[actual.id] }
        }, {})
        return finalIntials
      }
      return null
    },
    [intials],
  )

  const renderSteps = useCallback(
    () =>
      intials &&
      steps?.map(({ fields, id }) => {
        return (
          <Step
            isEditing={isEditing}
            showHelpIcon={showHelpIcon}
            intials={renderIntials(fields)}
            key={id}
            isFormData={isFormData}
            fields={fields}
            loading={loading}
            noFilterOptions={noFilterOptions}
            onSubmit={(vals) => setFormsValues((values) => ({ ...values, [id]: vals }))}
            ref={(e) => {
              const actual = formRef.current?.find((e) => e.id === id)
              if (!actual && e) {
                formRef.current = [...formRef.current, { id, form: e }]
              }
            }}
          />
        )
      }),
    [steps, isFormData, loading, noFilterOptions, intials, showHelpIcon, renderIntials, isEditing],
  )

  useEffect(() => {
    if (Object.keys(formsValues).length === steps?.length && onSubmit && !hasSubmitedRef.current) {
      onSubmit(formsValues)
      hasSubmitedRef.current = true
    }
  }, [formsValues, steps, onSubmit])

  if (!steps && !fields) {
    return <Typography>Se debe agregar 'fields' o 'steps'</Typography>
  }
  if (steps && fields) {
    return <Typography>Los parametros 'fields' y 'steps' no pueden ir juntos</Typography>
  }

  if (!steps && fields) {
    return (
      <Step
        {...props}
        intials={renderIntials(fields)}
        fields={fields}
        noFilterOptions={noFilterOptions}
      />
    )
  }

  if (!steps) return null

  return (
    <React.Fragment>
      <Tabs
        value={tab}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        onChange={(e, newVal) => setTab(newVal)}>
        {steps.map(({ title, id }, index) => (
          <Tab
            key={id}
            label={title}
            value={index}
            icon={formsValues[id] ? <FaCheck color="primary" /> : <FaTimes color="primary" />}
          />
        ))}
      </Tabs>
      <SwipeableViews className={classes.stepRoot} index={tab} onChangeIndex={(tab) => setTab(tab)}>
        {renderSteps() || <div />}
      </SwipeableViews>
      <Button
        disabled={loading}
        onClick={() => {
          hasSubmitedRef.current = false
          formRef.current.forEach((e) => e.form.submitForm())
        }}
        className={classes.btn}
        color="primary"
        endIcon={loading && <CircularProgress size={16} />}
        variant="outlined">
        {accept}
      </Button>
    </React.Fragment>
  )
}, compareKeys(['loading', 'fields', 'intials', 'steps']))

const useClasses = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
  stepRoot: {
    marginTop: theme.spacing(2),
  },
  btn: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignSelf: 'center',
  },
}))
