import React, { memo, useMemo, useState } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@material-ui/core'
import { DatePicker, DatePickerProps, MuiPickersUtilsProvider } from '@material-ui/pickers'
import enLocale from 'date-fns/locale/en-US'
import esLocale from 'date-fns/locale/es'
import { useField } from 'formik'
import { FaTimes } from 'react-icons/fa'
import { compareKeys } from '../../utils/addOns'
import AriaLabels from '../../utils/AriaLabels'
import { useLang } from '../../utils/CrudContext'
import useFilters, { Filter } from '../../utils/useFilters'
import BaseInput from './BaseInput'
import { ComunesProps, FormTypes } from './FormTypes'

const localeWrapper = {
  en: enLocale,
  es: esLocale,
}

export interface AlDateProps extends ComunesProps {
  type: FormTypes.Date
  fullWidth?: boolean
  locale?: 'en' | 'es'
  format?: string
  DateProps?: DatePickerProps
}

type DateValue = Date | null
type DateFilter = Filter<DateValue>
export default memo((props: AlDateProps) => {
  const lang = useLang()
  const { date } = useFilters()

  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)

  const {
    DateProps,
    id,
    title,
    grow,
    fullWidth,
    hide,
    locale,
    help,
    format,
    filter,
    loading,
    keepMounted,
    noFilterOptions,
    validate,
  } = props
  const [{ value }, { error, touched }, { setTouched, setValue }] = useField<
    DateValue | DateFilter
  >(id)

  const finalFormat = format || 'dd/MM/yyyy'

  const finalValue = useMemo(() => {
    let actualVal: DateValue = null
    if (filter) {
      actualVal = (value as DateFilter)?.value
      if ((actualVal as unknown) === '') actualVal = null
    } else {
      actualVal = value !== null ? (value as Date) : null
    }
    return actualVal
  }, [value, filter])

  const finalTitle = useMemo<string>(() => {
    const mandatory = !!validate?.describe().tests.find((e) => e.name === 'required')

    if (filter && title) {
      return title
    } else {
      return `${title} ${mandatory ? '*' : ''}`
    }
  }, [title, filter, validate])

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeWrapper[locale || 'es']}>
      <BaseInput grow={grow} fullWidth={fullWidth} ocultar={hide} keepMounted={keepMounted}>
        <DatePicker
          autoOk
          disabled={loading}
          error={!!error && touched}
          variant="inline"
          inputVariant="outlined"
          format={finalFormat}
          label={finalTitle}
          helperText={(touched && error) || help}
          fullWidth={fullWidth || true}
          value={finalValue}
          onChange={(val) => {
            setTouched(true)
            if (filter) {
              setValue({
                filter: (value as DateFilter).filter,
                value: val,
              })
            } else {
              setValue(val)
            }
          }}
          animateYearScrolling
          InputProps={{
            startAdornment: !noFilterOptions && filter && (
              <Tooltip aria-label={AriaLabels.BtnFilterTypes} title={lang.tooltips.defineFilter}>
                <div>
                  <IconButton
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setAnchorFilter(e.currentTarget)
                    }}>
                    {date.find((e) => e.id === (value as DateFilter).filter)?.icon}
                  </IconButton>
                </div>
              </Tooltip>
            ),
            endAdornment: (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  if (filter) {
                    setValue({ filter: (value as DateFilter).filter, value: null })
                  } else {
                    setValue(null)
                  }
                }}>
                <FaTimes />
              </IconButton>
            ),
          }}
          {...DateProps}
        />
        {filter && !noFilterOptions && (
          <Menu anchorEl={anchorFilter} open={!!anchorFilter}>
            {date.map((e) => (
              <MenuItem
                onClick={() => {
                  setAnchorFilter(null)
                  setValue({ filter: e.id, value: (value as DateFilter).value })
                }}
                selected={(value as DateFilter).filter === e.id}
                key={e.id}>
                <ListItemIcon>{e.icon}</ListItemIcon>
                <ListItemText>{e.text}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        )}
      </BaseInput>
    </MuiPickersUtilsProvider>
  )
}, compareKeys(['loading', 'hide']))
