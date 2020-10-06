import React, { memo, useMemo } from 'react'
import { Collapse, FormControlLabel, Switch, Typography } from '@material-ui/core'
import { useField } from 'formik'
import BaseInput from './BaseInput'
import { ComunesProps, Types } from './Types'
import useFilters, { Filter } from '../../utils/useFilters'

export interface AlSwitchProps extends ComunesProps {
  type: Types.Switch
}
type SwitchFilter = Filter<boolean>
export default memo((props: AlSwitchProps) => {
  const { id, title, grow, list, loading } = props
  const filterOptions = useFilters()
  const [{ value }, { error }, { setValue }] = useField<boolean | SwitchFilter>(id)

  const isFiltering = !!list?.filter
  const finalValue = useMemo(() => {
    if (isFiltering) {
      return (value as SwitchFilter).value
    }

    return value as boolean
  }, [isFiltering, value])

  return (
    <BaseInput grow={grow} centrado>
      <FormControlLabel
        disabled={loading}
        control={
          <Switch
            checked={finalValue}
            onChange={(_, value) => {
              if (isFiltering) {
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
})
