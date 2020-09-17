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
} from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'
import { grey } from '@material-ui/core/colors'

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
  const clases = useClases()
  return (
    <Dialog open={show} TransitionComponent={Transition}>
      {loading && <LinearProgress />}
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={clases.contenido}>
        {content?.split('\n').map((e) => (
          <DialogContentText key={e}>{e}</DialogContentText>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (onClose) onClose(false)
          }}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (onClose) onClose(true)
          }}
          color="primary"
          autoFocus>
          Accept
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
