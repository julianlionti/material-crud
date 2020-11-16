import React, { memo, useMemo } from 'react'
import { Collapse, FormControlLabel, Switch, Typography } from '@material-ui/core'
import { useField } from 'formik'
import { compareKeys } from '../../utils/addOns'
import { Filter } from '../../utils/useFilters'
import BaseInput from './BaseInput'
import { ComunesProps, FormTypes } from './FormTypes'

export interface AlSwitchProps extends ComunesProps {
  type: FormTypes.Switch
}
type SwitchFilter = Filter<boolean>
export default memo((props: AlSwitchProps) => {
  const { id, title, grow, hide, loading, filter, keepMounted } = props
  // const filterOptions = useFilters()
  const [{ value }, { error }, { setValue }] = useField<boolean | SwitchFilter>(id)

  const finalValue = useMemo(() => {
    if (filter) {
      return (value as SwitchFilter).value
    }

    return value as boolean
  }, [value, filter])

  return (
    <BaseInput grow={grow} centrado ocultar={hide} keepMounted={keepMounted}>
      <FormControlLabel
        disabled={loading}
        control={
          <Switch
            checked={finalValue}
            onChange={(_, value) => {
              if (filter) {
                setValue({ filter: 'equal', value })
              } else {
                setValue(value)
              }
            }}
            name={id}
          />
        }
        label={title}
      />
      <Collapse in={!!error} unmountOnExit timeout="auto">
        <Typography>{error}</Typography>
      </Collapse>
    </BaseInput>
  )
}, compareKeys(['loading', 'hide']))
