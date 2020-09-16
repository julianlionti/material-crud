import React, {useMemo, ReactNode, useEffect, useRef, useCallback} from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {useField} from 'formik'
import {TextField, Checkbox, Paper, makeStyles} from '@material-ui/core'
import {FaRegCheckSquare, FaRegSquare} from 'react-icons/fa'
import {OpcionesProps, Tipos, ComunesProps} from '.'
import BaseInput from './BaseInput'

export interface AlAutocompleteProps extends ComunesProps {
  tipo: Tipos.Autocomplete
  error?: any
  opciones: OpcionesProps[]
  multiple?: boolean
  onChangeText: (val: string) => void
  renderAgregado?: (props: {
    valores: OpcionesProps[]
    setAgregado: (value: any) => void
  }) => ReactNode
  placeholder?: string
}

export default (props: AlAutocompleteProps) => {
  const {
    id,
    titulo,
    cargando,
    opciones,
    onChangeText,
    placeholder,
    multiple,
    // error: wsError,
    renderAgregado,
    grow,
    validar,
    filtrar,
  } = props
  const warnRef = useRef(false)
  const [{value}, {error, touched}, {setValue, setTouched}] = useField<
    OpcionesProps[] | OpcionesProps
  >(id)

  // const err = wsError?.message.error?.mensaje || error
  const clases = useClases({grow})

  const valores = useMemo((): OpcionesProps[] | OpcionesProps => {
    if (multiple) {
      const valores = value as OpcionesProps[]
      return valores.map((e: any) => ({
        id: e.id,
        titulo: e.nombre || e.titulo,
        extras: e.extras,
      }))
    }
    return value
  }, [multiple, value])

  useEffect(() => {
    if (renderAgregado && !multiple && !warnRef.current) {
      console.warn('El render agregado solo se puede usar con el multiple')
      warnRef.current = true
    }
  }, [multiple, renderAgregado])

  const setAgregado = useCallback(
    (agregado) => {
      const vals = value as OpcionesProps[]
      const donde = vals.find((e) => e.id === agregado.id)
      donde!!.extras = {...donde!!.extras, comprados: agregado.cantidad}
    },
    [value],
  )

  const title = `${titulo} ${!filtrar && validar ? '*' : ''}`

  // useEffect(() => {
  //   if (wsError) {
  //     console.log(wsError)
  //     setError('Error en el WS')
  //   }
  // }, [setError, wsError])

  return (
    <BaseInput grow={grow}>
      <Autocomplete
        loadingText="Cargando..."
        loading={cargando}
        options={opciones}
        // disabled={cargando}
        value={valores}
        noOptionsText="Sin opciones"
        onChange={(e, vals) => {
          if (multiple) setValue(vals as OpcionesProps[])
          setValue(vals as OpcionesProps)
        }}
        onInputChange={(e, texto) => {
          if (texto.length > 0) onChangeText(texto)
        }}
        getOptionLabel={(e) => e.titulo || e.id}
        getOptionSelected={(option, value) => value?.id === option?.id}
        renderInput={(inputProps) => (
          <TextField
            label={title}
            placeholder={placeholder}
            error={!!error && touched}
            helperText={error}
            onBlur={() => setTouched(true)}
            variant="outlined"
            {...inputProps}
          />
        )}
        renderOption={(option, {selected}) => (
          <React.Fragment>
            <Checkbox
              icon={<FaRegSquare />}
              checkedIcon={<FaRegCheckSquare />}
              checked={selected}
            />
            {option.titulo}
          </React.Fragment>
        )}
        disableCloseOnSelect={multiple}
        multiple={multiple}
        fullWidth
      />
      {renderAgregado && multiple && (valores as OpcionesProps[]).length > -1 && (
        <Paper elevation={0} className={clases.agregado}>
          {renderAgregado({valores: valores as OpcionesProps[], setAgregado})}
        </Paper>
      )}
    </BaseInput>
  )
}

const useClases = makeStyles((tema) => ({
  agregado: {
    padding: tema.spacing(1),
  },
}))
