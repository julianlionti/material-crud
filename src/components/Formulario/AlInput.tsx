import React, {memo, ReactNode, useMemo, useState} from 'react'
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
import {Tipos, ComunesProps} from '.'
import {useField, useFormikContext} from 'formik'
import {
  FaArrowRight,
  FaNotEqual,
  FaEquals,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import BaseInput from './BaseInput'

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
  tipo: Tipos.Input | Tipos.Correo | Tipos.Multilinea | Tipos.Numerico | Tipos.Telefono
  maximo?: number
  submitear?: boolean
  placeholder?: string
  fullWidth?: boolean
  ocultar?: boolean
}

export default memo((props: AlInputProps) => {
  const {
    id,
    titulo,
    placeholder,
    validar,
    tipo,
    grow,
    maximo,
    submitear,
    cargando,
    filtrar,
    soloLectura,
    fullWidth,
    ayuda,
    ocultar,
  } = props
  const [anchorFiltro, setAnchorFiltro] = useState<HTMLElement | null>(null)
  const [{value}, {error, touched}, {setValue}] = useField<string | Filtro>(id)
  const formik = useFormikContext()

  const obligatorio = !!validar?.describe().tests.find((e) => e.name === 'required')
  const valMax = validar?.describe().tests.find((e) => e.name === 'max')?.params.max

  const tituloFinal = useMemo<string>(() => {
    if (filtrar) {
      return titulo
    } else {
      const valor = value as string
      return `${titulo} ${valMax ? `(${valor?.length || 0}/${valMax})` : ''} ${
        obligatorio ? '*' : ''
      }`
    }
  }, [filtrar, obligatorio, titulo, valMax, value])

  const valorFinal = useMemo(() => {
    if (filtrar) {
      return (value as Filtro).valor
    }
    return value as string
  }, [filtrar, value])

  const tipoFilto = useMemo(() => {
    switch (tipo) {
      case Tipos.Numerico:
        return opcionesFiltros.numerico
      default:
        return opcionesFiltros.texto
    }
  }, [tipo])

  return (
    <BaseInput grow={grow} fullWidth={fullWidth} ocultar={ocultar}>
      <FormControl
        fullWidth
        error={(touched && !!error) || (valorFinal?.length || 0) > valMax}
        variant="outlined">
        <InputLabel htmlFor={id}>{tituloFinal}</InputLabel>
        <OutlinedInput
          disabled={cargando || soloLectura}
          id={id}
          startAdornment={
            filtrar && (
              <Tooltip title={'Definir TIPO de filtro'}>
                <IconButton onClick={(e) => setAnchorFiltro(e.currentTarget)}>
                  {tipoFilto.find((e) => e.id === (value as Filtro).filtro)?.icono}
                </IconButton>
              </Tooltip>
            )
          }
          multiline={!filtrar && tipo === Tipos.Multilinea}
          rows={tipo === Tipos.Multilinea ? 4 : undefined}
          value={valorFinal}
          onChange={({target}) => {
            if (typeof value !== 'object') {
              setValue(target.value)
            } else {
              setValue({filtro: (value as Filtro).filtro, valor: target.value})
            }
          }}
          onKeyPress={({which}) => {
            if (which === 13 && submitear) {
              formik.submitForm()
            }
          }}
          placeholder={placeholder}
          type={tipo === Tipos.Numerico || tipo === Tipos.Telefono ? 'number' : undefined}
          label={tituloFinal}
          inputProps={{maxLength: maximo || undefined}}
        />
        {((touched && error) || ayuda) && (
          <FormHelperText id={id}>{(touched && error) || ayuda}</FormHelperText>
        )}
        {filtrar && (
          <Menu anchorEl={anchorFiltro} open={!!anchorFiltro}>
            {tipoFilto.map((e) => (
              <MenuItem
                onClick={() => {
                  setAnchorFiltro(null)
                  setValue({filtro: e.id, valor: (value as Filtro).valor})
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
