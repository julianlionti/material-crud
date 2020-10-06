import React, { memo, ReactNode, useMemo, useState } from 'react'
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core'
import { useField, useFormikContext } from 'formik'
import {
  FaArrowRight,
  FaNotEqual,
  FaEquals,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import BaseInput from './BaseInput'
import { Types, ComunesProps } from './Types'
import { useLang } from '../../utils/CrudContext'
import useFilters, { Filter } from '../../utils/useFilters'

export type InputsTypes =
  | Types.Input
  | Types.Email
  | Types.Multiline
  | Types.Number
  | Types.Phone

export interface AlInputProps extends ComunesProps {
  type: InputsTypes
  max?: number
  willSubmit?: boolean
  placeholder?: string
  fullWidth?: boolean
}

type InputFilter = Filter<string>
export default memo((props: AlInputProps) => {
  const {
    id,
    title,
    placeholder,
    validate,
    type,
    grow,
    max,
    willSubmit,
    loading,
    list,
    readonly,
    fullWidth,
    help,
    hide,
  } = props
  const lang = useLang()
  const filterOptions = useFilters()
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [{ value }, { error, touched }, { setValue }] = useField<string | InputFilter>(id)
  const formik = useFormikContext()

  const mandatory = !!validate?.describe().tests.find((e) => e.name === 'required')
  const valMax = validate?.describe().tests.find((e) => e.name === 'max')?.params.max

  const finalTitle = useMemo<string>(() => {
    if (list?.filter) {
      return title!!
    } else {
      const valor = value as string
      return `${title} ${valMax ? `(${valor?.length || 0}/${valMax})` : ''} ${
        mandatory ? '*' : ''
      }`
    }
  }, [list, mandatory, title, valMax, value])

  const finalValue = useMemo(() => {
    if (list?.filter) {
      return (value as Filter).value
    }
    return value as string
  }, [list, value])

  const filterType = useMemo(() => {
    switch (type) {
      case Types.Number:
        return filterOptions.numeric!!
      default:
        return filterOptions.text!!
    }
  }, [type, filterOptions])

  return (
    <BaseInput grow={grow} fullWidth={fullWidth} ocultar={hide}>
      <FormControl
        fullWidth
        error={(touched && !!error) || (finalValue?.length || 0) > valMax}
        variant="outlined">
        <InputLabel htmlFor={id}>{finalTitle}</InputLabel>
        <OutlinedInput
          disabled={loading || readonly}
          id={id}
          startAdornment={
            list?.filter && (
              <Tooltip title={lang?.tooltips.defineFilter || 'Definir TIPO de filtro'}>
                <IconButton onClick={(e) => setAnchorFilter(e.currentTarget)}>
                  {filterType.find((e) => e.id === (value as InputFilter).filter)?.icon}
                </IconButton>
              </Tooltip>
            )
          }
          multiline={!list?.filter && type === Types.Multiline}
          rows={type === Types.Multiline ? 4 : undefined}
          value={finalValue}
          onChange={({ target }) => {
            if (typeof value !== 'object') {
              setValue(target.value)
            } else {
              setValue({
                filter: (value as InputFilter).filter,
                value: target.value,
              })
            }
          }}
          onKeyPress={({ which }) => {
            if (which === 13 && willSubmit) {
              formik.submitForm()
            }
          }}
          placeholder={placeholder}
          type={type === Types.Number || type === Types.Phone ? 'number' : undefined}
          label={finalTitle}
          inputProps={{ maxLength: max || undefined }}
        />
        {((touched && error) || help) && (
          <FormHelperText id={id}>{(touched && error) || help}</FormHelperText>
        )}
        {list?.filter && (
          <Menu anchorEl={anchorFilter} open={!!anchorFilter}>
            {filterType.map((e) => (
              <MenuItem
                onClick={() => {
                  setAnchorFilter(null)
                  setValue({ filter: e.id, value: (value as InputFilter).value })
                }}
                selected={(value as InputFilter).filter === e.id}
                key={e.id}>
                <ListItemIcon>{e.icon}</ListItemIcon>
                <ListItemText>{e.text}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        )}
      </FormControl>
    </BaseInput>
  )
})
