import React, { useMemo, ReactNode, useEffect, useRef, useCallback, memo, useState } from 'react'
import {
  TextField,
  Checkbox,
  Paper,
  makeStyles,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { FormikContextType, useField, useFormikContext } from 'formik'
import { FaPlus, FaRegCheckSquare, FaRegSquare } from 'react-icons/fa'
import { compareKeys } from '../../utils/addOns'
import AriaLabels from '../../utils/AriaLabels'
import { useLang } from '../../utils/CrudContext'
import useFilters, { Filter } from '../../utils/useFilters'
import BaseInput from './BaseInput'
import { OpcionesProps, FormTypes, ComunesProps } from './FormTypes'

export interface AlAutocompleteProps extends ComunesProps {
  type: FormTypes.Autocomplete
  error?: any
  options: OpcionesProps[]
  multiple?: boolean
  onChangeText: (val: string) => void
  renderAggregate?: (props: {
    values: OpcionesProps[]
    setAggregate: (value: any) => void
  }) => ReactNode
  placeholder?: string
  onAddItem?: (props: HTMLDivElement) => void
  onSelect?: (formik: FormikContextType<any>) => void
}

type AutoValue = null | OpcionesProps | OpcionesProps[]
type AutoFilter = Filter<AutoValue>
export default memo((props: AlAutocompleteProps) => {
  const inputRef = useRef<any>()
  const {
    id,
    title,
    loading,
    options,
    onChangeText,
    placeholder,
    multiple,
    renderAggregate,
    grow,
    validate,
    filter,
    hide,
    onAddItem,
    keepMounted,
    onSelect,
  } = props
  const formik = useFormikContext()
  const lang = useLang()
  const { autocomplete } = useFilters()
  const warnRef = useRef(false)
  const [{ value }, { error, touched }, { setValue, setTouched }] = useField<
    AutoValue | AutoFilter
  >(id)

  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const clases = useClases({ grow })

  useEffect(() => {
    if (renderAggregate && !multiple && !warnRef.current) {
      console.warn('El render agregado solo se puede usar con el multiple')
      warnRef.current = true
    }
  }, [multiple, renderAggregate])

  const setAggregate = useCallback(
    (agregado) => {
      const vals = value as OpcionesProps[]
      const donde = vals.find((e) => e.id === agregado.id)
      if (donde) {
        donde.extras = { ...donde.extras, comprados: agregado.cantidad }
      }
    },
    [value],
  )

  const finalTitle = `${title} ${filter && validate ? '*' : ''}`

  const finalValue = useMemo(() => {
    if (filter) {
      return (value as AutoFilter).value
    } else {
      return value as AutoValue
    }
  }, [value, filter])

  const startAdornment = useMemo(
    () =>
      [
        <Tooltip aria-label={AriaLabels.BtnAddItem} key="add" title={lang.addItem}>
          <div>
            <IconButton disabled={loading} onClick={() => onAddItem && onAddItem(inputRef.current)}>
              <FaPlus size={16} />
            </IconButton>
          </div>
        </Tooltip>,
      ].filter((e) => e),
    [onAddItem, lang, loading],
  )

  return (
    <BaseInput grow={grow} ocultar={hide} keepMounted={keepMounted}>
      <Autocomplete
        innerRef={(e) => (inputRef.current = e)}
        loadingText={lang.loading}
        loading={loading}
        options={options}
        value={finalValue}
        noOptionsText={lang.noOptions}
        onChange={(_, vals) => {
          if (filter) {
            setValue({ filter: (value as AutoFilter).filter, value: vals })
          } else if (!filter) {
            if (onSelect) onSelect(formik)
            setValue(vals)
          }
        }}
        onInputChange={(_, texto) => {
          if (texto.length > 1) onChangeText(texto)
        }}
        getOptionLabel={(e) => e.title || e.id || ''}
        getOptionSelected={(option, value) => value?.id === option?.id}
        renderInput={({ InputProps, ...inputProps }) => (
          <TextField
            {...inputProps}
            InputProps={{
              ...InputProps,
              startAdornment: (
                <React.Fragment>
                  {onAddItem && startAdornment}
                  {InputProps.startAdornment}
                </React.Fragment>
              ),
              // startAdornment: onAddItem ? startAdornment : InputProps.startAdornment,
              // startAdornment: [
              //   filter && (
              //     <Tooltip
              //       aria-label={AriaLabels.BtnFilterTypes}
              //       key="filter"
              //       title={lang.tooltips.defineFilter}>
              //       <IconButton
              //         disabled={loading}
              //         onClick={(e) => setAnchorFilter(e.currentTarget)}>
              //         {autocomplete.find((e) => e.id === (value as AutoFilter).filter)?.icon}
              //       </IconButton>
              //     </Tooltip>
              //   ),
              //   InputProps.startAdornment,
              // ],
            }}
            label={finalTitle}
            placeholder={placeholder}
            error={!!error && touched}
            helperText={error}
            onBlur={() => setTouched(true)}
            variant="outlined"
          />
        )}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            {multiple && (
              <Checkbox
                icon={<FaRegSquare />}
                checkedIcon={<FaRegCheckSquare />}
                checked={selected}
              />
            )}
            {option.title}
          </React.Fragment>
        )}
        disableCloseOnSelect={multiple}
        multiple={multiple}
        fullWidth
      />
      {renderAggregate && multiple && (value as OpcionesProps[]).length > -1 && (
        <Paper elevation={0} className={clases.agregado}>
          {renderAggregate({
            values: value as OpcionesProps[],
            setAggregate,
          })}
        </Paper>
      )}
      {filter && (
        <Menu anchorEl={anchorFilter} open={!!anchorFilter}>
          {autocomplete.map((e) => (
            <MenuItem
              onClick={() => {
                setAnchorFilter(null)
                setValue({ filter: e.id, value: (value as AutoFilter).value })
              }}
              selected={(value as AutoFilter).filter === e.id}
              key={e.id}>
              <ListItemIcon>{e.icon}</ListItemIcon>
              <ListItemText>{e.text}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
    </BaseInput>
  )
}, compareKeys(['loading', 'options', 'renderAggregate', 'onChangeText', 'hide']))

const useClases = makeStyles((tema) => ({
  agregado: {
    padding: tema.spacing(1),
  },
}))
