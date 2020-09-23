import { IconButton, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import { useField, FieldArray } from 'formik'
import React, { memo, useEffect, useMemo } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import BaseInput from './BaseInput'
import AlInput, { InputsTypes } from './AlInput'
import { Types, ComunesProps } from './Types'

type ConfProps = { type: InputsTypes; title: string; id: string }[]
type ValuesProps = { [key: string]: any }

export interface AlMultipleProps extends ComunesProps {
  type: Types.Multiple
  configuration: ConfProps
}

export default memo((props: AlMultipleProps) => {
  const { id, title, grow, hide, configuration } = props
  const [{ value }, { error }, { setValue }] = useField<ValuesProps[]>(id)
  const classes = useClasses()

  const valFinal = useMemo(() => value || [], [value])

  return (
    <BaseInput grow={grow} ocultar={hide}>
      <Paper elevation={0}>
        <div className={classes.headerContainer}>
          <Typography variant="body1">{`${title} (${valFinal?.length})`}</Typography>
          <IconButton
            onClick={() =>
              setValue([
                ...valFinal,
                configuration.reduce((acc, it) => ({ ...acc, [it.id]: '' }), {}),
              ])
            }>
            <FaPlus />
          </IconButton>
        </div>
        {valFinal.map((_, index) => (
          <div key={index} className={classes.horizontal}>
            {configuration.map((col, i) => (
              <AlInput
                id={`${id}.${index}.${col.id}`}
                key={i}
                type={col.type}
                title={col.title}
              />
            ))}
            <IconButton onClick={() => setValue(valFinal.filter((_, i) => i !== index))}>
              <FaTrash />
            </IconButton>
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
