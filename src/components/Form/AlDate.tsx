import { DatePicker, DatePickerProps, MuiPickersUtilsProvider } from '@material-ui/pickers'
// import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import React, { useMemo, useState } from 'react'
import BaseInput from './BaseInput'
import { ComunesProps, Types } from './Types'
import DateFnsUtils from '@date-io/date-fns'
// import 'moment/locale/es'
import { useField } from 'formik'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@material-ui/core'
import useFilters, { Filter } from '../../utils/useFilters'
import { useLang } from '../../utils/CrudContext'
import AriaLabels from '../../utils/AriaLabels'
import enLocale from 'date-fns/locale/en-US'
import esLocale from 'date-fns/locale/es'

const localeWrapper = {
  en: enLocale,
  es: esLocale,
}

// import moment from 'moment'

export interface AlDateProps extends ComunesProps {
  type: Types.Date
  fullWidth?: boolean
  locale?: 'en' | 'es'
  format?: string
  DateProps?: DatePickerProps
}

type DateValue = Date | null
type DateFilter = Filter<DateValue>
export default (props: AlDateProps) => {
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
  } = props
  const [{ value }, { error, touched }, { setTouched, setValue }] = useField<
    DateValue | DateFilter
  >(id)

  const finalFormat = format || 'dd/MM/yyyy'

  const finalValue = useMemo(() => {
    let actualVal: DateValue = null
    if (filter) {
      actualVal = (value as DateFilter).value
    } else {
      actualVal = value !== null ? (value as Date) : null
    }
    return actualVal
  }, [value, filter])
  console.log(value)
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeWrapper[locale || 'es']}>
      <BaseInput grow={grow} fullWidth={fullWidth} ocultar={hide}>
        <DatePicker
          autoOk
          disabled={loading}
          error={!!error && touched}
          variant="inline"
          inputVariant="outlined"
          format={finalFormat}
          label={title}
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
            startAdornment: filter && (
              <Tooltip aria-label={AriaLabels.BtnFilterTypes} title={lang.tooltips.defineFilter}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setAnchorFilter(e.currentTarget)
                  }}>
                  {date!!.find((e) => e.id === (value as DateFilter).filter)?.icon}
                </IconButton>
              </Tooltip>
            ),
          }}
          {...DateProps}
        />
        {filter && (
          <Menu anchorEl={anchorFilter} open={!!anchorFilter}>
            {date!!.map((e) => (
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
}
