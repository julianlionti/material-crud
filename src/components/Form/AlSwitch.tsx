import React, { memo, useCallback, useMemo } from 'react'
import { Checkbox, Collapse, FormControlLabel, Switch, Typography } from '@material-ui/core'
import { FormikContextType, useField, useFormikContext } from 'formik'
import { compareKeys } from '../../utils/addOns'
import { Filter } from '../../utils/useFilters'
import BaseInput from './BaseInput'
import { ComunesProps, FormTypes } from './FormTypes'

export interface AlSwitchProps extends ComunesProps {
  type: FormTypes.Switch
  variant?: 'switch' | 'checkbox'
  onSelect?: (val: boolean, formik: FormikContextType<any>) => void
  isEditing?: boolean
}
type SwitchFilter = Filter<boolean>
export default memo((props: AlSwitchProps) => {
  const {
    id,
    title,
    grow,
    hide,
    loading,
    filter,
    keepMounted,
    variant,
    onSelect,
    readonly,
    isEditing,
  } = props
  // const filterOptions = useFilters()
  const [{ value }, { error }, { setValue }] = useField<boolean | SwitchFilter>(id)
  const formik = useFormikContext()

  const disabled = useMemo(() => {
    if (typeof readonly === 'function') return loading || readonly(formik.values)
    if (typeof readonly === 'boolean') return loading || readonly

    if (isEditing && readonly === 'edit') return loading || true
    if (!isEditing && readonly === 'new') return loading || true

    return loading || false
  }, [readonly, isEditing, formik.values, loading])

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
        if (onSelect) onSelect(value, formik)
        setValue(value)
      }
    },
    [filter, setValue, formik, onSelect],
  )

  const renderControl = useMemo(() => {
    if (variant === 'checkbox')
      return <Checkbox checked={finalValue} disabled={disabled} onChange={onChange} name={id} />
    return <Switch checked={finalValue} disabled={disabled} onChange={onChange} name={id} />
  }, [id, variant, onChange, finalValue, disabled])

  return (
    <BaseInput grow={grow} centrado ocultar={hide} keepMounted={keepMounted}>
      <FormControlLabel disabled={disabled} control={renderControl} label={title} />
      <Collapse in={!!error} unmountOnExit timeout="auto">
        <Typography variant="body2">{error}</Typography>
      </Collapse>
    </BaseInput>
  )
}, compareKeys(['loading', 'hide']))
