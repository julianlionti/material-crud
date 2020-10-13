import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from 'formik'
import React, { memo, ReactNode } from 'react'
import { CamposProps } from '.'
import { Types } from '../..'
import BaseInput from './BaseInput'
import { ComunesProps } from './Types'

export interface CustomComponentProps<T = any> {
  props: AlCustomProps
  field: [FieldInputProps<T>, FieldMetaProps<T>, FieldHelperProps<T>]
}

type NoTitle = Omit<ComunesProps, 'title'>
export interface AlCustomProps extends NoTitle {
  type: Types.Custom
  component: (props: CustomComponentProps) => ReactNode
  title?: string
}

export default memo((props: AlCustomProps) => {
  const { grow, component, id } = props
  const field = useField(id)
  return (
    <BaseInput grow={grow} ocultar={hide}>
      {component({ props, field })}
    </BaseInput>
  )
})
