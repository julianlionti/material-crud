import { DatePicker, DatePickerProps, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import React, { useMemo, useState } from 'react'
import BaseInput from './BaseInput'
import { ComunesProps, Types } from './Types'
import MomentUtils from '@date-io/moment'
import 'moment/locale/es'
import { useField } from 'formik'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@material-ui/core'
import useFilters, { Filter } from '../../utils/useFilters'
import { useLang } from '../../utils/CrudContext'
import AriaLabels from '../../utils/AriaLabels'
import moment from 'moment'

export interface AlDateProps extends ComunesProps {
  type: Types.Date
  fullWidth?: boolean
  locale?: 'en' | 'es'
  format?: string
  DateProps?: DatePickerProps
}

type DateValue = string | null
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

  const finalFormat = format || 'DD/MM/YYYY'

  const finalValue = useMemo(() => {
    let actualVal: DateValue = null
    if (filter) {
      actualVal = (value as DateFilter).value
    } else {
      actualVal = value !== null ? (value as string) : null
    }

    if (!actualVal) return actualVal
    return moment(actualVal, finalFormat)
  }, [value, filter, finalFormat])
  console.log(finalValue)

  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={locale || 'en'}>
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
                value: val?.format(finalFormat) || null,
              })
            } else {
              console.log(val, val?.format(finalFormat))
              setValue(val?.format(finalFormat) || null)
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
