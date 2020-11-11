import React, { useState, memo, useMemo, ReactNode, useCallback } from 'react'
import { makeStyles, IconButton, Typography, CircularProgress, Collapse } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { useField } from 'formik'
import { FaCamera, FaFile } from 'react-icons/fa'
import { compareKeys } from '../../utils/addOns'
import { useLang } from '../../utils/CrudContext'
import BaseInput from './BaseInput'
import { FormTypes, ComunesProps } from './FormTypes'

export interface AlImagenProps extends ComunesProps {
  type: FormTypes.Image | FormTypes.File
  baseURL?: string
  ImgButton?: ReactNode
  accept?: string
  renderPreview?: (base64: string | null) => ReactNode
}

export default memo((props: AlImagenProps) => {
  const lang = useLang()
  const {
    id,
    loading,
    grow,
    baseURL,
    ImgButton,
    type,
    renderPreview,
    hide,
    accept,
    title,
    validate,
  } = props
  const [base64, setBase64] = useState<string | null>(null)
  const [{ value }, { error, touched }, { setValue, setTouched }] = useField<string | File | null>(
    id,
  )
  const [subiendo, setSubiendo] = useState(false)

  const camaraId = `camara-${id}`
  const clases = useClases()

  const srcFinal = useMemo(() => {
    if (value instanceof window.File) {
      return base64
    } else if (typeof value === 'string') {
      return baseURL + value
    }
    return null
  }, [base64, baseURL, value])

  const isImage = type === FormTypes.Image

  const renderExplanation = useCallback(() => {
    if (!lang.inputs) return ''
    if (value === null && isImage) {
      return lang.inputs.image.new
    } else if (value === null && !isImage) {
      return lang.inputs.file.new
    } else if (value !== null && isImage) {
      return lang.inputs.image.edit
    } else {
      return lang.inputs.file.edit
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

  const finalTitle = useMemo<string>(() => {
    const mandatory = !!validate?.describe().tests.find((e) => e.name === 'required')

    return `${title} ${mandatory ? '*' : ''}`
  }, [title, validate])

  return (
    <BaseInput grow={grow} ocultar={hide}>
      <Typography>{finalTitle}</Typography>
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
          if (!e.currentTarget.files) return
          const archivo = e.currentTarget.files[0]
          if (archivo) {
            setSubiendo(true)
            const FR = new window.FileReader()
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
}, compareKeys(['loading']))

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
