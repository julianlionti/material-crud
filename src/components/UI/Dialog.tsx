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
  mostrar: boolean
  onCerrar?: (confirmado: boolean) => void
  titulo?: string
  contenido?: string
  cargando?: boolean
}

export const Transition = forwardRef(
  (
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />,
)

export default memo(({ mostrar, onCerrar, titulo, contenido, cargando }: Props) => {
  const clases = useClases()
  return (
    <Dialog open={mostrar} TransitionComponent={Transition}>
      {cargando && <LinearProgress />}
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent className={clases.contenido}>
        {contenido?.split('\n').map((e) => (
          <DialogContentText key={e}>{e}</DialogContentText>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (onCerrar) onCerrar(false)
          }}
          color="primary">
          Cancelar
        </Button>
        <Button
          onClick={() => {
            if (onCerrar) onCerrar(true)
          }}
          color="primary"
          autoFocus>
          Aceptar
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
