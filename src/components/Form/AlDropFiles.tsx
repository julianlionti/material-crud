import React, { memo, ReactNode, useCallback, useState } from 'react'
import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useField } from 'formik'
import { useDropzone } from 'react-dropzone'
import { FaFile, FaTrashAlt } from 'react-icons/fa'
import { compareKeys } from '../../utils/addOns'
import { useLang } from '../../utils/CrudContext'
import Dialog from '../UI/Dialog'
import BaseInput from './BaseInput'
import { ComunesProps, FormTypes } from './FormTypes'

type NoTitle = Omit<ComunesProps, 'title'>
export interface AlDropFilesProps extends NoTitle {
  type: FormTypes.Draggable
  multiple?: boolean
  accept?: string
  ImgIcon?: ReactNode
  title: string | ReactNode
  renderPreview?: (name: string) => ReactNode
  onDeleteFile?: (name: string) => Promise<boolean> | boolean
}

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
const niceBytes = (x: number) => {
  let l = 0
  let n = x

  while (n >= 1024 && ++l) {
    n = n / 1024
  }
  return n?.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l] || 0
}

export default memo(
  ({
    title,
    id,
    accept,
    grow,
    hide,
    ImgIcon,
    multiple,
    keepMounted,
    renderPreview,
    onDeleteFile,
    help,
  }: AlDropFilesProps) => {
    const [{ value }, { error, touched }, { setValue, setTouched }] = useField<(File | string)[]>(
      id,
    )
    const [deleteDialog, showDeleteDialog] = useState('')
    const [loading, setLoading] = useState(false)

    const {
      inputs: { drop },
    } = useLang()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (accepted) => {
        const realVal = value as File[]
        if (multiple && realVal) {
          const ids = new Set(realVal.map((d) => d.name))
          const merged = [...realVal, ...accepted.filter((d) => !ids.has(d.name))]
          setValue(merged)
        } else {
          setValue(accepted)
        }
      },
    })

    const classes = useClasses({ isDragActive, ImgIcon })

    const renderTitle = useCallback(() => {
      if (typeof title === 'string') return <Typography variant="body2">{title}</Typography>
      return title
    }, [title])

    const renderFilePrev = useCallback(() => {
      if (!value) return null

      return (
        <div className={classes.valContainer}>
          {value.map((e) => {
            let name: string
            let size: number | undefined
            let isFile = false
            if (e instanceof File) {
              name = e.name
              size = e.size
              isFile = true
            } else name = e

            const renderImage = () => {
              if (isFile || !renderPreview) return ImgIcon || <FaFile />
              return null // <Avatar src={baseURL + name} />
            }

            const renderTrashIcon = () => {
              if (isFile || onDeleteFile) {
                return (
                  <IconButton
                    onClick={(ev) => {
                      ev.preventDefault()
                      ev.stopPropagation()
                      if (isFile) {
                        setValue(
                          value.filter((v) => {
                            const realV = v as File
                            return realV.name !== name
                          }),
                        )
                      } else {
                        showDeleteDialog(name)
                      }
                    }}>
                    <FaTrashAlt />
                  </IconButton>
                )
              }

              return null
            }

            return (
              <Paper variant="outlined" elevation={3} key={name} className={classes.prevRoot}>
                <div className={classes.paperRoot}>
                  <div className={classes.textContainer}>
                    {(isFile || !renderPreview) && (
                      <div style={{ flex: 1 }} className={classes.imgContainer2}>
                        {renderImage()}
                      </div>
                    )}
                    {(isFile || !renderPreview) && (
                      <div style={{ flex: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {name}
                        </Typography>
                        {size && (
                          <Typography variant="subtitle2" noWrap>
                            {niceBytes(size)}
                          </Typography>
                        )}
                      </div>
                    )}
                    {!isFile && renderPreview && renderPreview(name)}
                  </div>
                  <div>{renderTrashIcon()}</div>
                </div>
              </Paper>
            )
          })}
        </div>
      )
    }, [ImgIcon, classes, setValue, value, renderPreview, onDeleteFile])

    return (
      <BaseInput grow={grow} ocultar={hide} keepMounted={keepMounted}>
        <div className={classes.base}>
          {renderTitle()}
          <div {...getRootProps({ className: classes.dropzone })}>
            <input
              {...getInputProps({
                name: id,
                accept,
                multiple,
                onChange: () => {
                  setTouched(true)
                },
              })}
            />
            <Typography className={classes.title} variant="body1">
              {help || drop.help}
            </Typography>
            <div className={classes.imgContainer}>
              {ImgIcon || <FaFile className={classes.verticalSpace} />}
            </div>
          </div>
          {error && touched && (
            <Typography variant="body1" className={classes.error}>
              {error}
            </Typography>
          )}
          {renderFilePrev()}
        </div>
        <Dialog
          show={!!deleteDialog}
          onClose={async (onYes) => {
            if (onYes && onDeleteFile) {
              setLoading(true)
              const hasToDelete = await onDeleteFile(deleteDialog)
              if (hasToDelete) {
                setValue(
                  value.filter((v) => {
                    const realV = v as string
                    return realV !== deleteDialog
                  }),
                )
                showDeleteDialog('')
              }
              setLoading(false)
            } else {
              showDeleteDialog('')
            }
          }}
          loading={loading}
          title={drop.title}
          content={drop.description}
        />
      </BaseInput>
    )
  },
  compareKeys(['loading', 'hide']),
)

const useClasses = makeStyles((theme) => ({
  base: {
    '&:hover': {
      backgroundColor: grey[100],
    },
    position: 'relative',
  },
  title: {
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
  },
  container: {
    display: 'flex',
  },
  bold: { fontWeight: 'bold' },
  horizontalSpace: { paddingLeft: theme.spacing(1), paddingRight: theme.spacing(2) },
  verticalSpace: { marginBottom: theme.spacing(1), marginTop: theme.spacing(1) },
  dropzone: ({ isDragActive }: any) => ({
    margin: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    height: 250,
    padding: theme.spacing(1),
    borderStyle: 'dotted',
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
    flexWrap: 'wrap',
  },
  paperRoot: {
    display: 'flex',
    flex: 1,
    width: 120,
    height: 90,
  },
  error: {
    color: theme.palette.error.main,
  },
  textContainer: {
    whiteSpace: 'nowrap',
    textOverflow: 'clip',
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  imgContainer: ({ ImgIcon }: any) => ({
    width: 80,
    height: 80,
    textAlign: 'center',
    ...(!ImgIcon ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}),
  }),
  imgContainer2: {
    width: 30,
    height: 30,
  },
  prevRoot: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
}))
