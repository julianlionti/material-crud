import React from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'
import { useField } from 'formik'
import BaseInput from './BaseInput'
import { ComunesProps, Tipos } from './Tipos'

export interface AlSwitchProps extends ComunesProps {
  type: Tipos.Switch
}

export default (props: AlSwitchProps) => {
  const { id, title, grow } = props
  const [{ value, onChange }] = useField(id)
  return (
    <BaseInput grow={grow} centrado>
      <FormControlLabel
        control={<Switch checked={value} onChange={onChange} name={id} />}
        label={title}
      />
    </BaseInput>
  )
}
