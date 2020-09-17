import React, { memo, ReactNode, useMemo, useState } from 'react'
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core'
import { useField, useFormikContext } from 'formik'
import {
  FaArrowRight,
  FaNotEqual,
  FaEquals,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import BaseInput from './BaseInput'
import { Types, ComunesProps } from './Types'

type FiltroTipo =
  | 'empiezaCon'
  | 'igual'
  | 'distinto'
  | 'contiene'
  | 'id'
  | 'array'
  | 'custom'
  | 'mayor'
  | 'menor'

interface Filtro {
  valor: string
  filtro: FiltroTipo
}

interface FiltrosMenu {
  id: FiltroTipo
  texto: string
  icono: ReactNode
}

interface FiltrosProps {
  texto: FiltrosMenu[]
  numerico: FiltrosMenu[]
}

const opcionesFiltros: FiltrosProps = {
  texto: [
    {
      id: 'empiezaCon',
      texto: 'Empieza con',
      icono: <FaArrowRight size={16} />,
    },
    {
      id: 'igual',
      texto: 'Igual',
      icono: <FaEquals size={16} />,
    },
    {
      id: 'distinto',
      texto: 'Distinto',
      icono: <FaNotEqual size={16} />,
    },
  ],
  numerico: [
    {
      id: 'igual',
      texto: 'Igual',
      icono: <FaEquals size={16} />,
    },
    {
      id: 'mayor',
      texto: 'Mayor',
      icono: <FaChevronRight size={16} />,
    },
    {
      id: 'menor',
      texto: 'Menor',
      icono: <FaChevronLeft size={16} />,
    },
  ],
}

export interface AlInputProps extends ComunesProps {
  type: Types.Input | Types.Email | Types.Multiline | Types.Number | Types.Phone
  max?: number
  willSubmit?: boolean
  placeholder?: string
  fullWidth?: boolean
}

export default memo((props: AlInputProps) => {
  const {
    id,
    title,
    placeholder,
    validate,
    type,
    grow,
    max,
    willSubmit,
    loading,
    filter,
    readonly,
    fullWidth,
    help,
    hide,
  } = props

  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [{ value }, { error, touched }, { setValue }] = useField<string | Filtro>(id)
  const formik = useFormikContext()

  const mandatory = !!validate?.describe().tests.find((e) => e.name === 'required')
  const valMax = validate?.describe().tests.find((e) => e.name === 'max')?.params.max

  const finalTitle = useMemo<string>(() => {
    if (filter) {
      return title
    } else {
      const valor = value as string
      return `${title} ${valMax ? `(${valor?.length || 0}/${valMax})` : ''} ${
        mandatory ? '*' : ''
      }`
    }
  }, [filter, mandatory, title, valMax, value])

  const finalValue = useMemo(() => {
    if (filter) {
      return (value as Filtro).valor
    }
    return value as string
  }, [filter, value])

  const filterType = useMemo(() => {
    switch (type) {
      case Types.Number:
        return opcionesFiltros.numerico
      default:
        return opcionesFiltros.texto
    }
  }, [type])

  return (
    <BaseInput grow={grow} fullWidth={fullWidth} ocultar={hide}>
      <FormControl
        fullWidth
        error={(touched && !!error) || (finalValue?.length || 0) > valMax}
        variant="outlined">
        <InputLabel htmlFor={id}>{finalTitle}</InputLabel>
        <OutlinedInput
          disabled={loading || readonly}
          id={id}
          startAdornment={
            filter && (
              <Tooltip title="Definir TIPO de filtro">
                <IconButton onClick={(e) => setAnchorFilter(e.currentTarget)}>
                  {filterType.find((e) => e.id === (value as Filtro).filtro)?.icono}
                </IconButton>
              </Tooltip>
            )
          }
          multiline={!filter && type === Types.Multiline}
          rows={type === Types.Multiline ? 4 : undefined}
          value={finalValue}
          onChange={({ target }) => {
            if (typeof value !== 'object') {
              setValue(target.value)
            } else {
              setValue({
                filtro: (value as Filtro).filtro,
                valor: target.value,
              })
            }
          }}
          onKeyPress={({ which }) => {
            if (which === 13 && willSubmit) {
              formik.submitForm()
            }
          }}
          placeholder={placeholder}
          type={type === Types.Number || type === Types.Phone ? 'number' : undefined}
          label={finalTitle}
          inputProps={{ maxLength: max || undefined }}
        />
        {((touched && error) || help) && (
          <FormHelperText id={id}>{(touched && error) || help}</FormHelperText>
        )}
        {filter && (
          <Menu anchorEl={anchorFilter} open={!!anchorFilter}>
            {filterType.map((e) => (
              <MenuItem
                onClick={() => {
                  setAnchorFilter(null)
                  setValue({ filtro: e.id, valor: (value as Filtro).valor })
                }}
                selected={(value as Filtro).filtro === e.id}
                key={e.id}>
                <ListItemIcon>{e.icono}</ListItemIcon>
                <ListItemText>{e.texto}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        )}
      </FormControl>
    </BaseInput>
  )
})
