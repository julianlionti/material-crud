import React, { memo } from 'react'
import { Typography, TypographyProps } from '@material-ui/core'
import { FormTypes, BaseProps } from '../Form/FormTypes'
import BaseInput from './BaseInput'

export interface AlOnlyTitleProps extends BaseProps {
  type: FormTypes.OnlyTitle
  titleProps?: TypographyProps
}

export default memo((props: AlOnlyTitleProps) => {
  const { title, titleProps } = props
  return (
    <BaseInput>
      <Typography variant="body2" {...titleProps}>
        {title}
      </Typography>
    </BaseInput>
  )
})
