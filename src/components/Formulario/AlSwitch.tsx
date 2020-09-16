import React from 'react'
import {FormGroup, FormControlLabel, Switch} from '@material-ui/core'
import {ComunesProps, Tipos} from '.'
import {useField} from 'formik'
import BaseInput from './BaseInput'

export interface AlSwitchProps extends ComunesProps {
  tipo: Tipos.Switch
}

export default (props: AlSwitchProps) => {
  const {id, titulo, grow} = props
  const [{value, onChange}] = useField(id)
  return (
    <BaseInput grow={grow} centrado>
      <FormControlLabel
        control={<Switch checked={value} onChange={onChange} name={id} />}
        label={titulo}
      />
    </BaseInput>
  )
}
