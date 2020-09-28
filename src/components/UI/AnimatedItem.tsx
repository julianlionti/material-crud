import React, { memo, ReactNode } from 'react'
import { Collapse, makeStyles } from '@material-ui/core'

interface Props {
  children: ReactNode
  edited: boolean
  deleted: boolean
}

export default memo(({ children, edited, deleted }: Props) => {
  const classes = useClasses()

  return (
    <Collapse
      className={`${edited ? classes.edited : ''}`}
      timeout={1000}
      in={!deleted}
      unmountOnExit>
      {children}
    </Collapse>
  )
})

const useClasses = makeStyles(() => ({
  edited: {
    animation: '$shake 0.5s',
    animationIterationCount: 1,
  },
  '@keyframes shake': {
    '0%': { transform: 'translate(1px, 1px) rotate(0deg)' },
    '10%': { transform: 'translate(-1px, -2px) rotate(-1deg)' },
    '20%': { transform: 'translate(-3px, 0px) rotate(1deg)' },
    '30%': { transform: 'translate(3px, 2px) rotate(0deg)' },
    '40%': { transform: 'translate(1px, -1px) rotate(1deg)' },
    '50%': { transform: 'translate(-1px, 2px) rotate(-1deg)' },
    '60%': { transform: 'translate(-3px, 1px) rotate(0deg)' },
    '70%': { transform: 'translate(3px, 1px) rotate(-1deg)' },
    '80%': { transform: 'translate(-1px, -1px) rotate(1deg)' },
    '90%': { transform: 'translate(1px, 2px) rotate(0deg)' },
    '100%': { transform: 'translate(1px, -2px) rotate(-1deg)' },
  },
}))
