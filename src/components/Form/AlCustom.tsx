import React, { memo, ReactNode } from 'react'
import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from 'formik'
import BaseInput from './BaseInput'
import { FormTypes, ComunesProps } from './FormTypes'

export interface CustomComponentProps<T = any> {
  props: AlCustomProps
  field: [FieldInputProps<T>, FieldMetaProps<T>, FieldHelperProps<T>]
}

type NoTitle = Omit<ComunesProps, 'title'>
export interface AlCustomProps extends NoTitle {
  type: FormTypes.Custom
  component: (props: CustomComponentProps) => ReactNode
  title?: string
}

export default memo((props: AlCustomProps) => {
  const { grow, component, id, hide } = props
  const field = useField(id)
  return (
    <BaseInput grow={grow} ocultar={hide}>
      {component({ props, field })}
    </BaseInput>
  )
})
