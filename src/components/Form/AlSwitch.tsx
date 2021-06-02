import React, { memo, useCallback, useMemo } from 'react'
import { Checkbox, Collapse, FormControlLabel, Switch, Typography } from '@material-ui/core'
import { useField } from 'formik'
import { compareKeys } from '../../utils/addOns'
import { Filter } from '../../utils/useFilters'
import BaseInput from './BaseInput'
import { ComunesProps, FormTypes } from './FormTypes'

export interface AlSwitchProps extends ComunesProps {
  type: FormTypes.Switch
  variant?: 'switch' | 'checkbox'
}
type SwitchFilter = Filter<boolean>
export default memo((props: AlSwitchProps) => {
  const { id, title, grow, hide, loading, filter, keepMounted, variant } = props
  // const filterOptions = useFilters()
  const [{ value }, { error }, { setValue }] = useField<boolean | SwitchFilter>(id)

  const finalValue = useMemo(() => {
    if (filter) {
      return (value as SwitchFilter).value
    }

    return value as boolean
  }, [value, filter])

  const onChange = useCallback(
    (e, value) => {
      if (filter) {
        setValue({ filter: 'equal', value })
      } else {
        setValue(value)
      }
    },
    [filter, setValue],
  )

  const renderControl = useMemo(() => {
    if (variant === 'checkbox')
      return <Checkbox checked={finalValue} onChange={onChange} name={id} />
    return <Switch checked={finalValue} onChange={onChange} name={id} />
  }, [id, variant, onChange, finalValue])

  return (
    <BaseInput grow={grow} centrado ocultar={hide} keepMounted={keepMounted}>
      <FormControlLabel disabled={loading} control={renderControl} label={title} />
      <Collapse in={!!error} unmountOnExit timeout="auto">
        <Typography variant="body2">{error}</Typography>
      </Collapse>
    </BaseInput>
  )
}, compareKeys(['loading', 'hide']))
