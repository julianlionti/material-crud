import React, { memo, ReactNode } from 'react'
import { makeStyles, Collapse } from '@material-ui/core'

interface Props {
  children: ReactNode
  grow?: number
  fullWidth?: boolean
  centrado?: boolean
  ocultar?: boolean
}

export default memo(({ children, grow, fullWidth, centrado, ocultar }: Props) => {
  const clases = useClases({ grow, fullWidth, centrado })
  return (
    <Collapse className={clases.input} in={!ocultar} unmountOnExit timeout="auto">
      {children}
    </Collapse>
  )
})

const useClases = makeStyles((tema) => ({
  input: ({ grow, fullWidth, centrado }: any) => ({
    margin: tema.spacing(1),
    flex: fullWidth === false ? undefined : 1,
    flexGrow: grow,
    display: centrado ? 'flex' : undefined,
    alignItems: centrado ? 'center' : undefined,
    minHeight: 390,
  }),
}))
