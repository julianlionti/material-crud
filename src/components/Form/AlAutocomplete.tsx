import React, { useMemo, ReactNode, useEffect, useRef, useCallback, memo } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useField } from 'formik'
import { TextField, Checkbox, Paper, makeStyles } from '@material-ui/core'
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa'
import BaseInput from './BaseInput'
import { OpcionesProps, Types, ComunesProps } from './Types'
import { useLang } from '../../utils/CrudContext'

export interface AlAutocompleteProps extends ComunesProps {
  type: Types.Autocomplete
  error?: any
  options: OpcionesProps[]
  multiple?: boolean
  onChangeText: (val: string) => void
  renderAggregate?: (props: {
    values: OpcionesProps[]
    setAggregate: (value: any) => void
  }) => ReactNode
  placeholder?: string
}

export default memo((props: AlAutocompleteProps) => {
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
    list,
  } = props
  const lang = useLang()
  const warnRef = useRef(false)
  const [{ value }, { error, touched }, { setValue, setTouched }] = useField<
    OpcionesProps[] | OpcionesProps
  >(id)

  // const err = wsError?.message.error?.mensaje || error
  const clases = useClases({ grow })

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
    if (renderAggregate && !multiple && !warnRef.current) {
      console.warn('El render agregado solo se puede usar con el multiple')
      warnRef.current = true
    }
  }, [multiple, renderAggregate])

  const setAggregate = useCallback(
    (agregado) => {
      const vals = value as OpcionesProps[]
      const donde = vals.find((e) => e.id === agregado.id)
      donde!!.extras = { ...donde!!.extras, comprados: agregado.cantidad }
    },
    [value],
  )

  const finalTitle = `${title} ${!list?.filter && validate ? '*' : ''}`

  return (
    <BaseInput grow={grow}>
      <Autocomplete
        loadingText={lang?.loading || 'Cargando...'}
        loading={loading}
        options={options}
        value={valores}
        noOptionsText={lang?.noOptions || 'Sin opciones'}
        onChange={(_, vals) => {
          if (multiple) setValue(vals as OpcionesProps[])
          setValue(vals as OpcionesProps)
        }}
        onInputChange={(_, texto) => {
          if (texto.length > 0) onChangeText(texto)
        }}
        getOptionLabel={(e) => e.title || e.id}
        getOptionSelected={(option, value) => value?.id === option?.id}
        renderInput={(inputProps) => (
          <TextField
            label={finalTitle}
            placeholder={placeholder}
            error={!!error && touched}
            helperText={error}
            onBlur={() => setTouched(true)}
            variant="outlined"
            {...inputProps}
          />
        )}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={<FaRegSquare />}
              checkedIcon={<FaRegCheckSquare />}
              checked={selected}
            />
            {option.title}
          </React.Fragment>
        )}
        disableCloseOnSelect={multiple}
        multiple={multiple}
        fullWidth
      />
      {renderAggregate && multiple && (valores as OpcionesProps[]).length > -1 && (
        <Paper elevation={0} className={clases.agregado}>
          {renderAggregate({
            values: valores as OpcionesProps[],
            setAggregate,
          })}
        </Paper>
      )}
    </BaseInput>
  )
})

const useClases = makeStyles((tema) => ({
  agregado: {
    padding: tema.spacing(1),
  },
}))
