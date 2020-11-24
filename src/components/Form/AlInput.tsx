import React, { memo, useMemo, useState } from 'react'
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
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { compareKeys } from '../../utils/addOns'
import AriaLabels from '../../utils/AriaLabels'
import { useLang } from '../../utils/CrudContext'
import useFilters, { Filter } from '../../utils/useFilters'
import BaseInput from './BaseInput'
import { FormTypes, ComunesProps } from './FormTypes'

export type InputsTypes =
  | FormTypes.Input
  | FormTypes.Email
  | FormTypes.Multiline
  | FormTypes.Number
  | FormTypes.Phone
  | FormTypes.Secure

export interface AlInputProps extends ComunesProps {
  type: InputsTypes
  max?: number
  willSubmit?: boolean
  placeholder?: string
  fullWidth?: boolean
  onBlur?: (val: string) => void
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
    readonly,
    fullWidth,
    help,
    hide,
    filter,
    onBlur,
    keepMounted,
    noFilterOptions,
  } = props
  const [hasSecure, setHasSecure] = useState(true)
  const lang = useLang()
  const filterOptions = useFilters()
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [{ value }, { error, touched }, { setValue }] = useField<string | InputFilter>(id)
  const formik = useFormikContext()

  const mandatory = !!validate?.describe().tests.find((e) => e.name === 'required')
  const valMax = validate?.describe().tests.find((e) => e.name === 'max')?.params.max

  const finalTitle = useMemo<string>(() => {
    if (filter && title) {
      return title
    } else {
      const valor = value as string
      return `${title} ${valMax ? `(${valor?.length || 0}/${valMax})` : ''} ${mandatory ? '*' : ''}`
    }
  }, [mandatory, title, valMax, value, filter])

  const finalValue = useMemo(() => {
    if (filter) {
      return (value as Filter).value
    }
    return value as string
  }, [value, filter])

  const filterType = useMemo(() => {
    switch (type) {
      case FormTypes.Number:
        return filterOptions.numeric
      default:
        return filterOptions.text
    }
  }, [type, filterOptions])

  const inputType = useMemo(() => {
    switch (type) {
      case FormTypes.Email:
        return 'email'
      case FormTypes.Secure: {
        return hasSecure ? 'password' : undefined
      }
      case FormTypes.Number:
        return 'number'
      case FormTypes.Phone:
        return 'tel'
      default:
        return undefined
    }
  }, [type, hasSecure])

  return (
    <BaseInput grow={grow} fullWidth={fullWidth} ocultar={hide} keepMounted={keepMounted}>
      <FormControl
        fullWidth
        error={(touched && !!error) || (finalValue?.length || 0) > valMax}
        variant="outlined">
        <InputLabel htmlFor={id}>{finalTitle}</InputLabel>
        <OutlinedInput
          disabled={loading || readonly}
          id={id}
          startAdornment={
            !noFilterOptions &&
            filter && (
              <Tooltip aria-label={AriaLabels.BtnFilterTypes} title={lang.tooltips.defineFilter}>
                <div>
                  <IconButton disabled={loading} onClick={(e) => setAnchorFilter(e.currentTarget)}>
                    {filterType.find((e) => e.id === (value as InputFilter).filter)?.icon}
                  </IconButton>
                </div>
              </Tooltip>
            )
          }
          endAdornment={
            FormTypes.Secure === type && (
              <Tooltip title={hasSecure ? lang.tooltips.showPass : lang.tooltips.hidePass}>
                <div>
                  <IconButton disabled={loading} onClick={() => setHasSecure((hs) => !hs)}>
                    {hasSecure ? <FaEye /> : <FaEyeSlash />}
                  </IconButton>
                </div>
              </Tooltip>
            )
          }
          multiline={!filter && type === FormTypes.Multiline}
          rows={type === FormTypes.Multiline ? 4 : undefined}
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
          onBlur={() => {
            if (!filter && onBlur) {
              onBlur(value as string)
            }
          }}
          placeholder={placeholder}
          type={inputType}
          label={finalTitle}
          inputProps={{ maxLength: max || undefined }}
        />
        {((touched && error) || help) && (
          <FormHelperText id={id}>{(touched && error) || help}</FormHelperText>
        )}
        {filter && (
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
}, compareKeys(['loading', 'hide']))
