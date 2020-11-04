import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import { Formik, FormikValues, FormikHelpers, FormikProps } from 'formik'
import { serialize } from 'object-to-formdata'
import { FaCheck, FaTimes } from 'react-icons/fa'
import SwipeableViews from 'react-swipeable-views'
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
import { FormTypes, AlExpandableProps } from './FormTypes'
import { generateDefault } from './helpers'
import Step from './Step'

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
  | AlExpandableProps

export type FieldProps = TodosProps | TodosProps[]
export interface StepProps {
  id: string
  title: string
  fields: FieldProps[]
}

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

export const createFields = (props: FieldProps[]) => props // (props: () => CamposProps[]) => props()
export const createSteps = (props: StepProps[]) => props // (props: () => CamposProps[]) => props()

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

  /*
  return (
    <TabContext value={tab}>
      <TabList
        onChange={(e, tabVal) => {
          const act = formRef.current.find((e) => e.id === tab)
          console.log(act?.form.values)
          // console.log(act?.form.submitForm())
          setTab(tabVal)
        }}>
        {steps!!.map(({ title, id }) => (
          <Tab key={id} label={title} value={id} />
        ))}
      </TabList>
      {steps!!.map(({ fields, id }) => (
        <TabPanel key={id} value={id!!}>
          <Step
            isFormData={isFormData}
            fields={fields}
            loading={loading}
            accept="prueba"
            onSubmit={(e) => console.log(e)}
            ref={(e) => {
              const actual = formRef.current?.find((e) => e.id === id)
              if (!actual) {
                formRef.current = [...formRef.current, { id, form: e!! }]
              } else {
                formRef.current.map((e) => {
                  if (e.id === id) return { id, form: e }
                  return e
                })
              }
            }}
          />
        </TabPanel>
      ))}
      <Button
        disabled={loading}
        onClick={() => {
          // formRef.current.
        }}
        className={classes.btn}
        color="primary"
        endIcon={loading && <CircularProgress size={16} />}
        variant="outlined">
        {accept}
      </Button>
    </TabContext>
  )
  */
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
