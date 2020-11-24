import React, { memo, ReactNode } from 'react'
import { makeStyles, Collapse } from '@material-ui/core'
import AriaLabels from '../../utils/AriaLabels'

interface Props {
  children: ReactNode
  grow?: number
  fullWidth?: boolean
  centrado?: boolean
  ocultar?: boolean
  keepMounted?: boolean
  noFilterOptions?: boolean
}

export default memo(({ children, grow, fullWidth, centrado, ocultar, keepMounted }: Props) => {
  const clases = useClases({ grow, fullWidth, centrado })
  return (
    <Collapse className={clases.input} in={!ocultar} unmountOnExit={!keepMounted} timeout="auto">
      <div aria-label={AriaLabels.BaseInput}> {children}</div>
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
