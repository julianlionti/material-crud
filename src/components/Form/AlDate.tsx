import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import React, { useState } from 'react'
import BaseInput from './BaseInput'
import { ComunesProps, Types } from './Types'
import MomentUtils from '@date-io/moment'
import 'moment/locale/es'
import { useField } from 'formik'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@material-ui/core'
import useFilters, { Filter } from '../../utils/useFilters'
import { useLang } from '../../utils/CrudContext'
import AriaLabels from '../../utils/AriaLabels'

export interface AlDateProps extends ComunesProps {
  type: Types.Date
  fullWidth?: boolean
  locale?: 'en' | 'es'
  format?: string
}

type DateFilter = Filter<MaterialUiPickersDate>
export default (props: AlDateProps) => {
  const lang = useLang()
  const { date } = useFilters()

  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)

  const { id, title, grow, fullWidth, hide, locale, help, format, filter } = props
  const [{ value }, { error, touched }, { setTouched, setValue }] = useField<
    MaterialUiPickersDate | DateFilter
  >(id)

  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={locale || 'en'}>
      <BaseInput grow={grow} fullWidth={fullWidth} ocultar={hide}>
        <DatePicker
          autoOk
          error={!!error && touched}
          variant="inline"
          inputVariant="outlined"
          format={format || 'DD/MM/YYYY'}
          label={title}
          helperText={(touched && error) || help}
          fullWidth={fullWidth || true}
          value={value}
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
