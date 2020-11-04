import React, { memo, useEffect, useRef, useState } from 'react'
import { Button, CircularProgress, makeStyles, Tab, Tabs, Typography } from '@material-ui/core'
import { FormikValues, FormikHelpers, FormikProps } from 'formik'
import { FaCheck, FaTimes } from 'react-icons/fa'
import SwipeableViews from 'react-swipeable-views'
import * as Yup from 'yup'
import { StepProps, FieldProps } from './FormTypes'
import Step from './Step'

Yup.setLocale({
  string: {
    max: ({ path, max }) => `${path} debe contener ${max} caracteres máximo`,
  },
  mixed: {
    required: ({ path }) => `El ${path} es obligatorio`,
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
}

export const createFields = (props: FieldProps[]) => props
export const createSteps = (props: StepProps[]) => props

interface RefProps {
  form: FormikProps<any>
  id: string
}
export default memo((props: FormProps) => {
  const hasSubmitedRef = useRef(false)
  const formRef = useRef<RefProps[]>([])
  const [formsValues, setFormsValues] = useState({})
  const { fields, steps, loading, isFormData, accept, onSubmit } = props

  const [tab, setTab] = useState(0)

  const classes = useClasses()

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
    return <Step {...props} fields={props.fields!!} />
  }

  return (
    <React.Fragment>
      <Tabs
        value={tab}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        onChange={(e, newVal) => setTab(newVal)}>
        {steps!!.map(({ title, id }, index) => (
          <Tab
            key={id}
            label={title}
            value={index}
            icon={formsValues[id] ? <FaCheck color="primary" /> : <FaTimes color="primary" />}
          />
        ))}
      </Tabs>
      <SwipeableViews className={classes.stepRoot} index={tab} onChangeIndex={(tab) => setTab(tab)}>
        {steps!!.map(({ fields, id }) => (
          <Step
            key={id}
            isFormData={isFormData}
            fields={fields}
            loading={loading}
            onSubmit={(vals) => setFormsValues((values) => ({ ...values, [id]: vals }))}
            ref={(e) => {
              const actual = formRef.current?.find((e) => e.id === id)
              if (!actual) {
                formRef.current = [...formRef.current, { id, form: e!! }]
              }
            }}
          />
        ))}
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
})

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
