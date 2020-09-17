import React, { useState, memo, useMemo } from 'react'
import {
  makeStyles,
  IconButton,
  Typography,
  CircularProgress,
  Collapse,
} from '@material-ui/core'
import { ReactComponent as Camara } from '../../assets/icons/camera.svg'
import { useField } from 'formik'
import { red } from '@material-ui/core/colors'
import BaseInput from './BaseInput'
import { Types, ComunesProps } from './Types'

export interface AlImagenProps extends ComunesProps {
  type: Types.Image
  baseURL: string
}

export default memo((props: AlImagenProps) => {
  const { id, loading, grow, baseURL } = props
  const [base64, setBase64] = useState<string | null>(null)
  const [{ value }, { error }, { setValue, setTouched }] = useField<string | File | null>(
    id,
  )
  const [subiendo, setSubiendo] = useState(false)

  const camaraId = `camara-${id}`
  const clases = useClases()

  const srcFinal = useMemo(() => {
    if (value instanceof File) {
      return base64
    } else if (typeof value === 'string') {
      return baseURL + value
    }
    return null
  }, [base64, baseURL, value])

  console.log(srcFinal, value)

  return (
    <BaseInput grow={grow}>
      <Collapse in={!subiendo}>
        <div className={clases.contenedor}>
          {subiendo && <CircularProgress />}
          <Typography variant="body1">
            Haga <i>click</i> en la <i>{value === '' ? 'camara' : 'imagen'}</i> para
            {value === '' ? ' subir una imagen.' : ' editarla '}
          </Typography>
          <label htmlFor={camaraId}>
            <IconButton
              disabled={loading}
              color="primary"
              component="span"
              onClick={() => {
                setTouched(true)
              }}>
              {srcFinal ? (
                <img height={300} alt={id} src={srcFinal} />
              ) : (
                <Camara className={clases.icono} />
              )}
            </IconButton>
          </label>
          {!!error && (
            <Typography variant="caption" className={clases.textoError}>
              {error}
            </Typography>
          )}
        </div>
      </Collapse>
      <input
        type="file"
        accept="image/*"
        disabled={loading}
        className={clases.input}
        id={camaraId}
        onChange={(e) => {
          const archivo = e.currentTarget.files!![0]
          if (archivo) {
            setSubiendo(true)
            var FR = new FileReader()
            FR.addEventListener('load', function (e) {
              setValue(archivo)
              setBase64(e.target?.result as string)
              setSubiendo(false)
            })
            FR.readAsDataURL(archivo)
          }
        }}
      />
    </BaseInput>
  )
})

const useClases = makeStyles(() => ({
  contenedor: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  icono: {
    width: 80,
    height: 80,
  },
  input: {
    display: 'none',
  },
  textoError: {
    color: red[500],
  },
}))
