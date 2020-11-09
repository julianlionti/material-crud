import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
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
  makeStyles,
} from '@material-ui/core'
import { useField } from 'formik'
import { FaPlus } from 'react-icons/fa'
import AriaLabels from '../../utils/AriaLabels'
import { useLang } from '../../utils/CrudContext'
import useFilters, { Filter } from '../../utils/useFilters'
import BaseInput from './BaseInput'
import { FormTypes, ComunesProps, OpcionesProps } from './FormTypes'

export interface AlSelectProps extends ComunesProps {
  type: FormTypes.Options
  placeholder: string
  options: OpcionesProps[]
  onAddItem?: (props: HTMLDivElement) => void
}

type SelectFilter = Filter<string>
export default memo((props: AlSelectProps) => {
  const inputRef = useRef<any>()
  const {
    id,
    title,
    placeholder,
    validate,
    grow,
    options,
    loading,
    hide,
    filter,
    onAddItem,
  } = props
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

  const selectItem = useCallback(
    (valInput: string) => {
      const finalValInput = valInput === '-1' ? '' : valInput
      if (filter) {
        setValue({
          filter: (value as SelectFilter).filter,
          value: finalValInput,
        })
      } else {
        setValue(finalValInput)
      }
    },
    [filter, setValue, value],
  )

  const classes = useClasses()

  return (
    <BaseInput grow={grow} ocultar={hide}>
      <div style={{ display: 'flex' }} ref={(e) => (inputRef.current = e)}>
        <FormControl fullWidth error={touched && !!error} variant="outlined">
          <InputLabel htmlFor={id}>{finalTitle}</InputLabel>
          <Select
            startAdornment={
              filter && (
                <Tooltip aria-label={AriaLabels.BtnFilterTypes} title={lang.tooltips.defineFilter}>
                  <div>
                    <IconButton
                      disabled={loading}
                      onClick={(e) => setAnchorFilter(e.currentTarget)}>
                      {select.find((e) => e.id === (value as SelectFilter).filter)?.icon}
                    </IconButton>
                  </div>
                </Tooltip>
              )
            }
            disabled={loading}
            placeholder={placeholder}
            labelId={id}
            id={`${id}-select`}
            value={finalValue}
            onChange={({ target: { value: valInput } }) => selectItem(valInput as string)}
            label={finalTitle}>
            <MenuItem value="">
              <em>{placeholder || 'Seleccione una opción'}</em>
            </MenuItem>
            {options.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.title || e.id}
              </MenuItem>
            ))}
            {onAddItem && (
              <MenuItem value="-1" onClick={() => onAddItem(inputRef.current)}>
                <FaPlus className={classes.addIcon} />
                <em>{lang.addItem}</em>
              </MenuItem>
            )}
          </Select>
          {touched && error && <FormHelperText id={id}>{error}</FormHelperText>}
        </FormControl>
      </div>
      {filter && (
        <Menu anchorEl={anchorFilter} open={!!anchorFilter}>
          {select.map((e) => (
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

const useClasses = makeStyles((theme) => ({
  addIcon: {
    marginRight: theme.spacing(1),
  },
}))
