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
  Chip,
} from '@material-ui/core'
import { useField } from 'formik'
import { FaPlus } from 'react-icons/fa'
import { compareKeys } from '../../utils/addOns'
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
  multiple?: boolean
  onSelect?: (val: ValueType) => void
}

type SelectFilter = Filter<OpcionesProps | OpcionesProps[]>
type ValueType = OpcionesProps | OpcionesProps[]
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
    multiple,
    onSelect,
  } = props
  const [{ value }, { error, touched }, { setValue }] = useField<ValueType | SelectFilter>(id)

  const lang = useLang()
  const { select } = useFilters()
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)

  const finalTitle = useMemo(() => {
    return `${title} ${!filter && validate ? '*' : ''}`
  }, [title, filter, validate])

  const finalValue = useMemo(() => {
    if (multiple && filter) return (value as SelectFilter).value
    if (multiple && !filter) return value

    if (filter) {
      const filval = (value as SelectFilter).value as OpcionesProps
      return filval // .title || filval.id
    }
    const singlevalue = value as OpcionesProps
    return singlevalue // .title || singlevalue.id
  }, [value, filter, multiple])

  const selectItem = useCallback(
    (valInput: ValueType) => {
      let finalValInput: ValueType = valInput
      if (!multiple) {
        const vinput = valInput as OpcionesProps
        finalValInput = vinput.id === '-1' ? { id: '' } : vinput
      }

      if (filter) {
        setValue({
          filter: (value as SelectFilter).filter,
          value: finalValInput,
        })
      } else {
        setValue(finalValInput)
      }
    },
    [filter, setValue, value, multiple],
  )

  const classes = useClasses()
  return (
    <BaseInput grow={grow} ocultar={hide}>
      <div style={{ display: 'flex' }} ref={(e) => (inputRef.current = e)}>
        <FormControl disabled={loading} fullWidth error={touched && !!error} variant="outlined">
          <InputLabel htmlFor={id}>{finalTitle}</InputLabel>
          <Select
            multiple={multiple}
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
            renderValue={
              !multiple
                ? undefined
                : () => {
                    const finalValue = value as OpcionesProps[]
                    return (
                      <div className={classes.chips}>
                        {finalValue.map(({ id, title }) => (
                          <Chip
                            onMouseDown={(event) => {
                              event.stopPropagation()
                            }}
                            onDelete={() => {
                              setValue(finalValue.filter((e) => e.id !== id))
                            }}
                            key={id}
                            label={title || id}
                            className={classes.chip}
                          />
                        ))}
                      </div>
                    )
                  }
            }
            placeholder={placeholder}
            labelId={id}
            id={`${id}-select`}
            value={finalValue}
            onChange={({ target: { value: valInput } }) => {
              if (onSelect) onSelect(valInput as ValueType)
              selectItem(valInput as ValueType)
            }}
            label={finalTitle}>
            <MenuItem disabled value="">
              <em>{placeholder || 'Seleccione una opción'}</em>
            </MenuItem>
            {options.map((e) => (
              <MenuItem key={e.id} value={e as any}>
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
}, compareKeys(['loading', 'hide', 'options']))

const useClasses = makeStyles((theme) => ({
  addIcon: {
    marginRight: theme.spacing(1),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}))
