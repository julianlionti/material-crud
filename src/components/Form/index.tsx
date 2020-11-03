import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import {
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import { Formik, FormikValues, FormikHelpers, FormikProps } from 'formik'
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
  onSubmit?: (values: FormikValues, helpers: FormikHelpers<any>) => void | Promise<any>
  accept?: string
  loading?: boolean
  intials?: any
  noValidate?: boolean
  inline?: boolean
  isFormData?: boolean
}

export const createFields = (props: FieldProps[]) => props // (props: () => CamposProps[]) => props()
export const createSteps = (props: StepProps[]) => props // (props: () => CamposProps[]) => props()

export default memo((props: FormProps) => {
  const formRef = useRef<FormikProps<any>>()
  const { fields, steps, loading, isFormData, accept } = props

  const [firstStep] = steps || []
  const [tab, setTab] = useState(firstStep?.id || '')

  const classes = useClasses()

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
    <TabContext value={tab}>
      <TabList variant="fullWidth" onChange={(e, tabVal) => setTab(tabVal)}>
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
            ref={(e) => formRef.current}
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
})

const useClasses = makeStyles((theme) => ({
  btn: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignSelf: 'center',
  },
}))
