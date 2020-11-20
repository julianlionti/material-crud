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

type SelectFilter = Filter<string | string[]>
type ValueType = string | string[]
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
    keepMounted,
  } = props
  const [{ value }, { error, touched }, { setValue }] = useField<ValueType | SelectFilter>(id)

  const lang = useLang()
  const { select } = useFilters()
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)

  const finalTitle = useMemo(() => {
    return `${title} ${!filter && validate ? '*' : ''}`
  }, [title, filter, validate])

  const finalValue = useMemo(() => {
    if (!multiple) {
      if (filter) {
        const filval = (value as SelectFilter).value
        return filval // .title || filval.id
      }
      const singlevalue = value
      return singlevalue // .title || singlevalue.id
    }

    if (filter) {
      const val = (value as SelectFilter).value
      if (val === '') return []
      const filval = val as string[]
      return filval.map((e) => e.toString())
    } else {
      return (value as string[]).map((e) => e.toString())
    }
  }, [value, filter, multiple])

  const selectItem = useCallback(
    (valInput: ValueType) => {
      const finalValInput: ValueType = valInput
      if (!multiple) {
        setValue(finalValInput)
      }

      if (filter) {
        setValue({
          filter: (value as SelectFilter)?.filter,
          value: finalValInput,
        })
      } else {
        const finalValInputArray = finalValInput as string[]
        setValue(
          finalValInputArray
            .filter((x) => x)
            .map((e): string => {
              const item = options.find((elem) => elem.id.toString() === e)
              return item?.id || e || '-'
            }),
        )
      }
    },
    [filter, setValue, value, multiple, options],
  )

  const classes = useClasses()
  return (
    <BaseInput grow={grow} ocultar={hide} keepMounted={keepMounted}>
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
                    const finalValueArray = finalValue as string[]
                    return (
                      <div className={classes.chips}>
                        {finalValueArray?.map((e) => {
                          const { id, title } =
                            options.find((elem) => elem.id.toString() === e) || {}
                          return (
                            <Chip
                              onMouseDown={(event) => {
                                event.stopPropagation()
                              }}
                              onDelete={() => {
                                setValue(finalValueArray.filter((e) => e !== id))
                              }}
                              key={id}
                              label={title || id}
                              className={classes.chip}
                            />
                          )
                        })}
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
