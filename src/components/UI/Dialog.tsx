import React, { forwardRef, memo } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  LinearProgress,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { TransitionProps } from '@material-ui/core/transitions'
import AriaLabels from '../../utils/AriaLabels'
import { useLang } from '../../utils/CrudContext'

export interface CartelState {
  visible: boolean
  titulo?: string
  contenido?: string | null
  onCerrar?: (confirmado: boolean) => void
}

export interface Props {
  show: boolean
  onClose?: (confirmado: boolean) => void
  title?: string
  content?: string
  loading?: boolean
}

export const Transition = forwardRef(
  (
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />,
)

export default memo(({ show, onClose, title, content, loading }: Props) => {
  const lang = useLang()
  const clases = useClases()

  if (!lang.dialog) return <Typography>Hace falta 'lang.dialog'</Typography>

  return (
    <Dialog open={show} TransitionComponent={Transition} aria-label={AriaLabels.Dialog.Root}>
      {loading && <LinearProgress />}
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={clases.contenido}>
        {content?.split('\n').map((e) => (
          <DialogContentText key={e}>{e}</DialogContentText>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          aria-label={AriaLabels.Dialog.NoBtn}
          onClick={() => {
            if (onClose) onClose(false)
          }}
          color="primary">
          {lang.dialog.cancel}
        </Button>
        <Button
          aria-label={AriaLabels.Dialog.YesBtn}
          onClick={() => {
            if (onClose) onClose(true)
          }}
          color="primary"
          autoFocus>
          {lang.dialog.accept}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

const useClases = makeStyles((tema) => ({
  contenido: {
    backgroundColor: grey[50],
    boxShadow: tema.shadows[1],
  },
}))
