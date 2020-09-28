import React, { memo, ReactNode } from 'react'
import { Collapse, makeStyles } from '@material-ui/core'
import { ShakeHorizontal } from 'reshake'

interface Props {
  children: ReactNode
  edited: boolean
  deleted: boolean
}

export default memo(({ children, edited, deleted }: Props) => {
  console.log(edited)

  return (
    <ShakeHorizontal>
      <span>Prueba</span>
      <Collapse timeout={2000} in={!deleted} unmountOnExit>
        {children}
      </Collapse>
    </ShakeHorizontal>
  )
})
