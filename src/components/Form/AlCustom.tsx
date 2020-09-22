import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from 'formik'
import React, { memo, ReactNode } from 'react'
import { CamposProps } from '.'
import { Types } from '../..'
import BaseInput from './BaseInput'
import { ComunesProps } from './Types'

export interface CustomComponentProps {
  props: CamposProps
  field: [FieldInputProps<any>, FieldMetaProps<any>, FieldHelperProps<any>]
}

export interface AlCustomProps extends ComunesProps {
  type: Types.Custom
  component: (props: CustomComponentProps) => ReactNode
}

export default memo((props: AlCustomProps) => {
  const { grow, component, id } = props
  const field = useField(id)
  return <BaseInput grow={grow}>{component({ props, field })}</BaseInput>
})
