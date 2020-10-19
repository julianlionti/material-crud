import React, { memo, ReactNode, useCallback } from 'react'
import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import { FaFile, FaTrashAlt } from 'react-icons/fa'
import { useDropzone } from 'react-dropzone'
import { useField } from 'formik'
import { grey } from '@material-ui/core/colors'
import { ComunesProps, Types } from './Types'
import BaseInput from './BaseInput'

type NoTitle = Omit<ComunesProps, 'title'>
export interface AlDropFilesProps extends NoTitle {
  type: Types.Draggable
  multiple?: boolean
  accept?: string
  ImgIcon?: ReactNode
  title: string | ReactNode
}

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
const niceBytes = (x: number) => {
  let l = 0
  let n = x

  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]
}

export default memo(({ title, id, accept, grow, hide, ImgIcon, multiple }: AlDropFilesProps) => {
  const [{ value }, { error, touched }, { setValue, setTouched }] = useField<File[]>(id)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (aceptados) => {
      var ids = new Set(value.map((d) => d.name))
      var merged = [...value, ...aceptados.filter((d) => !ids.has(d.name))]
      setValue(merged)
    },
  })

  const renderTitle = useCallback(() => {
    if (typeof title === 'string') return <Typography>{title}</Typography>
    return title
  }, [title])

  const classes = useClasses({ isDragActive })
  return (
    <BaseInput grow={grow} ocultar={hide}>
      <div className={classes.base}>
        {renderTitle()}
        <div {...getRootProps({ className: classes.dropzone })}>
          <input
            {...getInputProps({
              accept,
              multiple,
              onChange: () => {
                setTouched(true)
              },
            })}
          />
          <Typography>Arrastre el archivo AQUI</Typography>
          <div className={classes.imgContainer}>
            {ImgIcon || <FaFile className={classes.verticalSpace} />}
          </div>
          <div className={classes.valContainer}>
            {value.map((e) => (
              <Paper elevation={3} key={e.name} style={{ padding: 8, margin: 8 }}>
                <div className={classes.paperRoot}>
                  <div style={{ whiteSpace: 'nowrap', textOverflow: 'clip', width: '70%' }}>
                    <div className={classes.imgContainer2}>{ImgIcon || <FaFile />}</div>
                    <Typography variant="subtitle2" noWrap>
                      {e.name}
                    </Typography>
                    <Typography variant="subtitle2" noWrap>
                      {niceBytes(e.size)}
                    </Typography>
                  </div>
                  <div>
                    <IconButton
                      onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        setValue(value.filter((v) => v.name !== e.name))
                      }}>
                      <FaTrashAlt />
                    </IconButton>
                  </div>
                </div>
              </Paper>
            ))}
          </div>
        </div>
        {error && touched && <Typography className={classes.error}>{error}</Typography>}
      </div>
    </BaseInput>
  )
})

const useClasses = makeStyles((theme) => ({
  base: {
    '&:hover': {
      backgroundColor: grey[100],
    },
  },
  container: {
    display: 'flex',
  },
  bold: { fontWeight: 'bold' },
  horizontalSpace: { paddingLeft: theme.spacing(1), paddingRight: theme.spacing(2) },
  verticalSpace: { marginBottom: theme.spacing(1), marginTop: theme.spacing(1) },
  dropzone: ({ isDragActive }: any) => ({
    position: 'relative',
    margin: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '90%',
    height: 250,
    padding: theme.spacing(1),
    borderStyle: 'dashed',
    borderColor: 'black',
    borderWidth: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: isDragActive ? 'coral' : 'white',
  }),
  valContainer: {
    position: 'absolute',
    left: theme.spacing(1),
    right: theme.spacing(1),
    bottom: theme.spacing(1),
    zIndex: 200,
    display: 'flex',
  },
  paperRoot: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    width: 120,
    height: 90,
  },
  error: {
    color: theme.palette.error.main,
  },
  imgContainer: {
    width: 80,
    height: 80,
  },
  imgContainer2: {
    width: 30,
    height: 30,
    textAlign: 'center',
  },
}))
