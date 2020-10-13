import React, { memo, useMemo, useState } from 'react'
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { useField } from 'formik'
import BaseInput from './BaseInput'
import { Types, ComunesProps, OpcionesProps } from './Types'
import useFilters, { Filter } from '../../utils/useFilters'
import { FaCamera } from 'react-icons/fa'
import { useLang } from '../../utils/CrudContext'
import AriaLabels from '../../utils/AriaLabels'

export interface AlSelectProps extends ComunesProps {
  type: Types.Options
  placeholder: string
  options: OpcionesProps[]
}

type SelectFilter = Filter<string>
export default memo((props: AlSelectProps) => {
  const { id, title, placeholder, validate, list, grow, options, loading, hide, filter } = props
  const [{ value }, { error, touched }, { setValue }] = useField<string | SelectFilter>(id)

  const lang = useLang()
  const { select } = useFilters()
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)

  const finalTitle = `${title} ${filter && validate ? '*' : ''}`

  const finalValue = useMemo(() => {
    if (filter) {
      return (value as SelectFilter).value
    }
    return value as string
  }, [value, filter])

  return (
    <BaseInput grow={grow} ocultar={hide}>
      <div style={{ display: 'flex' }}>
        <FormControl fullWidth error={touched && !!error} variant="outlined">
          <InputLabel htmlFor={id}>{finalTitle}</InputLabel>
          <Select
            startAdornment={
              filter && (
                <Tooltip aria-label={AriaLabels.BtnFilterTypes} title={lang.tooltips.defineFilter}>
                  <IconButton onClick={(e) => setAnchorFilter(e.currentTarget)}>
                    {select!!.find((e) => e.id === (value as SelectFilter).filter)?.icon}
                  </IconButton>
                </Tooltip>
              )
            }
            disabled={loading}
            placeholder={placeholder}
            labelId={id}
            id={`${id}-select`}
            value={finalValue}
            onChange={({ target: { value: valInput } }) => {
              if (filter) {
                setValue({
                  filter: (value as SelectFilter).filter,
                  value: valInput as string,
                })
              } else {
                setValue(valInput as string)
              }
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
      </div>
      {filter && (
        <Menu anchorEl={anchorFilter} open={!!anchorFilter}>
          {select!!.map((e) => (
            <MenuItem
              onClick={() => {
                setAnchorFilter(null)
                setValue({ filter: e.id, value: (value as SelectFilter).value })
              }}
              selected={(value as SelectFilter).filter === e.id}
              key={e.id}>
              <ListItemIcon>{e.icon}</ListItemIcon>
              <ListItemText>{e.text}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
    </BaseInput>
  )
})
