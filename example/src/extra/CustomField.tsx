import React from 'react'
import { CustomComponentProps } from 'material-crud'
import { TextField } from '@material-ui/core'

export default ({ field, props }: CustomComponentProps) => {
  const [{ value, onChange }, { error }, { setValue }] = field
  return (
    <TextField
      variant="outlined"
      fullWidth
      value={value}
      onChange={({ target: { value } }) => setValue(value)}
      title={'Titlo custom'}
    />
  )
}
