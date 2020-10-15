import React, { useState, memo, useMemo, ReactNode, useCallback } from 'react'
import { makeStyles, IconButton, Typography, CircularProgress, Collapse } from '@material-ui/core'
import { ReactComponent as Camara } from '../../assets/icons/camera.svg'
import { useField } from 'formik'
import { red } from '@material-ui/core/colors'
import BaseInput from './BaseInput'
import { Types, ComunesProps } from './Types'
import { useLang } from '../../utils/CrudContext'
import { FaCamera, FaFile } from 'react-icons/fa'

export interface AlImagenProps extends ComunesProps {
  type: Types.Image | Types.File
  baseURL?: string
  ImgButton?: ReactNode
  accept?: string
  renderPreview?: (base64: string | null) => ReactNode
}

export default memo((props: AlImagenProps) => {
  const lang = useLang()
  const { id, loading, grow, baseURL, ImgButton, type, renderPreview, hide, accept } = props
  const [base64, setBase64] = useState<string | null>(null)
  const [{ value }, { error, touched }, { setValue, setTouched }] = useField<string | File | null>(
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

  const isImage = type === Types.Image

  const renderExplanation = useCallback(() => {
    if (value === null && isImage) {
      return lang.inputs!!.image.new
    } else if (value === null && !isImage) {
      return lang.inputs!!.file.new
    } else if (value !== null && isImage) {
      return lang.inputs!!.image.edit
    } else {
      return lang.inputs!!.file.edit
    }
  }, [value, isImage, lang])

  const renderContent = useCallback(() => {
    if (srcFinal && isImage) {
      return <img height={300} alt={id} src={srcFinal} />
    } else if (value && !isImage && renderPreview) {
      return renderPreview(base64 || srcFinal)
    } else if (value && !isImage && !renderPreview) {
      return <span>Es necesario renderizar el resultado con el 'renderPreview'</span>
    } else {
      if (ImgButton) return ImgButton
      return isImage ? <FaCamera className={clases.icono} /> : <FaFile className={clases.icono} />
    }
  }, [srcFinal, value, isImage, ImgButton, clases, base64, id, renderPreview])

  return (
    <BaseInput grow={grow} ocultar={hide}>
      <Collapse in={!subiendo} timeout="auto">
        <div className={clases.contenedor}>
          {subiendo && <CircularProgress />}
          <label htmlFor={camaraId} className={clases.lblContainer}>
            <Typography className={clases.pointer} onClick={() => setTouched(true)} variant="body1">
              {renderExplanation()}
            </Typography>
            <IconButton
              disabled={loading}
              color="primary"
              component="span"
              onClick={() => setTouched(true)}>
              {renderContent()}
            </IconButton>
          </label>
          {!!error && touched && (
            <Typography variant="caption" className={clases.textoError}>
              {error}
            </Typography>
          )}
        </div>
      </Collapse>
      <input
        type="file"
        accept={accept || 'image/*'}
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
  lblContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  pointer: {
    cursor: 'pointer',
  },
}))
