import { FormControl, InputLabel, OutlinedInput } from '@material-ui/core'
import React, { memo, useMemo } from 'react'
import BaseInput from './BaseInput'
import { ComunesProps, Types } from './Types'

export interface InputProps extends ComunesProps {
  type: Types // .Input | Types.Email | Types.Multiline | Types.Number | Types.Phone
  max?: number
  placeholder?: string
  fullWidth?: boolean
  value: string
  onChange: (value: string) => void
}

export default memo((props: InputProps) => {
  const {
    id,
    type,
    grow,
    validate,
    fullWidth,
    hide,
    value,
    onChange,
    title,
    loading,
    readonly,
    placeholder,
    max,
  } = props

  const mandatory = !!validate?.describe().tests.find((e) => e.name === 'required')
  const valMax = validate?.describe().tests.find((e) => e.name === 'max')?.params.max

  const finalTitle = useMemo<string>(() => {
    const valor = value as string
    return `${title} ${valMax ? `(${valor?.length || 0}/${valMax})` : ''} ${
      mandatory ? '*' : ''
    }`
  }, [value, title, mandatory, valMax])

  return (
    <BaseInput grow={grow} fullWidth={fullWidth} ocultar={hide}>
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor={id}>{finalTitle}</InputLabel>
        <OutlinedInput
          disabled={loading || readonly}
          id={id}
          multiline={type === Types.Multiline}
          rows={type === Types.Multiline ? 4 : undefined}
          value={value}
          onChange={({ target: { value } }) => onChange(value)}
          placeholder={placeholder}
          type={type === Types.Number || type === Types.Phone ? 'number' : undefined}
          label={finalTitle}
          inputProps={{ maxLength: max || undefined }}
        />
      </FormControl>
    </BaseInput>
  )
})
