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
  showHelpIcon?: boolean
}

export default memo((props: Props) => {
  const { children, grow, fullWidth, centrado, ocultar, keepMounted, showHelpIcon } = props
  const clases = useClases({ grow, fullWidth, centrado, showHelpIcon })
  return (
    <Collapse className={clases.input} in={!ocultar} unmountOnExit={!keepMounted} timeout="auto">
      <div aria-label={AriaLabels.BaseInput}> {children}</div>
    </Collapse>
  )
})

const useClases = makeStyles((theme) => ({
  input: ({ grow, fullWidth, centrado, showHelpIcon }: any) => ({
    margin: theme.spacing(1),
    marginRight: theme.spacing(showHelpIcon ? 6 : 1),
    flex: fullWidth === false ? undefined : 1,
    flexGrow: grow,
    display: centrado ? 'flex' : undefined,
    alignItems: centrado ? 'center' : undefined,
    minHeight: 390,
  }),
}))
