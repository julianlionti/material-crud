import React, {memo} from 'react'
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from '@material-ui/core'
import {ComunesProps, OpcionesProps, Tipos} from '.'
import {useField} from 'formik'
import BaseInput from './BaseInput'

export interface AlSelectProps extends ComunesProps {
  tipo: Tipos.Opciones
  placeholder: string
  opciones: OpcionesProps[]
}

export default memo((props: AlSelectProps) => {
  const {
    id,
    titulo,
    placeholder,
    validar,
    filtrar,
    grow,
    opciones,
    cargando,
    ocultar,
  } = props
  const [{value}, {error, touched}, {setValue}] = useField<string>(id)

  const title = `${titulo} ${!filtrar && validar ? '*' : ''}`

  return (
    <BaseInput grow={grow} ocultar={ocultar}>
      <FormControl fullWidth error={touched && !!error} variant="outlined">
        <InputLabel htmlFor={id}>{title}</InputLabel>
        <Select
          disabled={cargando}
          placeholder={placeholder}
          labelId={id}
          id={`${id}-select`}
          value={value}
          onChange={({target: {value}}) => {
            setValue(value as string)
          }}
          label={title}>
          <MenuItem value="">
            <em>{placeholder || 'Seleccione una opción'}</em>
          </MenuItem>
          {opciones.map((e) => (
            <MenuItem key={e.id} value={e.id}>
              {e.titulo || e.id}
            </MenuItem>
          ))}
        </Select>
        {touched && error && <FormHelperText id={id}>{error}</FormHelperText>}
      </FormControl>
    </BaseInput>
  )
})
