import { IconButton, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import { useField } from 'formik'
import React, { memo, useEffect, useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import BaseInput from './BaseInput'
import Input from './Input'
import { InputsTypes } from './AlInput'
import { Types, ComunesProps } from './Types'

type ConfProps = { type: InputsTypes; title: string; id: string }[]

export interface AlMultipleProps extends ComunesProps {
  type: Types.Multiple
  configuration: ConfProps
}

export default memo((props: AlMultipleProps) => {
  const { id, title, grow, hide, configuration } = props
  const [{ value }, { error }, { setValue }] = useField<ConfProps>(id)
  const classes = useClasses()

  const valFinal = useMemo(() => value || [], [value])

  return (
    <BaseInput grow={grow} ocultar={hide}>
      <Paper elevation={0}>
        <div className={classes.headerContainer}>
          <Typography variant="body1">{`${title} (${valFinal?.length})`}</Typography>
          <IconButton
            onClick={() => {
              setValue(
                valFinal.concat([
                  { id: 'sada', title: 'sadas', type: Types.Input },
                  { id: 'sadasdasda', title: 'sa232das', type: Types.Input },
                ]),
              )
            }}>
            <FaPlus />
          </IconButton>
        </div>
        {valFinal.map((item, index) => (
          <div key={index} className={classes.horizontal}>
            {configuration.map((col) => (
              <Input
                key={col.id}
                value={item[col.id]}
                onChange={(text) => {
                  const final = valFinal.map((e, i) => {
                    if (index === i) {
                      return { ...e, [col.id]: text }
                    }
                    return e
                  })
                  setValue(final)
                }}
                {...col}
              />
            ))}
          </div>
        ))}
      </Paper>
    </BaseInput>
  )
})

const useClasses = makeStyles(() => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontal: {
    display: 'flex',
  },
}))
