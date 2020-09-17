import React, { memo } from 'react'
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from '@material-ui/core'
import { useField } from 'formik'
import BaseInput from './BaseInput'
import { Types, ComunesProps, OpcionesProps } from './Types'

export interface AlSelectProps extends ComunesProps {
  type: Types.Options
  placeholder: string
  options: OpcionesProps[]
}

export default memo((props: AlSelectProps) => {
  const { id, title, placeholder, validate, filter, grow, options, loading, hide } = props
  const [{ value }, { error, touched }, { setValue }] = useField<string>(id)

  const finalTitle = `${title} ${!filter && validate ? '*' : ''}`

  return (
    <BaseInput grow={grow} ocultar={hide}>
      <FormControl fullWidth error={touched && !!error} variant="outlined">
        <InputLabel htmlFor={id}>{finalTitle}</InputLabel>
        <Select
          disabled={loading}
          placeholder={placeholder}
          labelId={id}
          id={`${id}-select`}
          value={value}
          onChange={({ target: { value } }) => {
            setValue(value as string)
          }}
          label={finalTitle}>
          <MenuItem value="">
            <em>{placeholder || 'Seleccione una opción'}</em>
          </MenuItem>
          {options.map((e) => (
            <MenuItem key={e.id} value={e.id}>
              {e.title || e.id}
            </MenuItem>
          ))}
        </Select>
        {touched && error && <FormHelperText id={id}>{error}</FormHelperText>}
      </FormControl>
    </BaseInput>
  )
})
