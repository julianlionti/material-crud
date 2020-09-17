import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import { useField } from 'formik'
import React, { useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import Formulario from '.'
import BaseInput from './BaseInput'
import { Types, ComunesProps } from './Types'

type ConfProps = { [key: string]: { tipo: Types; title: string } }

export interface AlMultipleProps extends ComunesProps {
  type: Types.Multiple
  configuration: ConfProps
}

export default (props: AlMultipleProps) => {
  const { id, title, grow, hide, configuration } = props
  const [{ value }, { error }, { setValue }] = useField<ConfProps[]>(id)

  const classes = useClasses()

  const fields = useMemo<any>(
    () =>
      value.map((e) =>
        Object.keys(e).map((key) => {
          const conf = configuration[key]
          return { id: key, titulo: conf.title, tipo: conf.tipo }
        }),
      ),
    [configuration, value],
  )

  console.log(fields)

  return (
    <BaseInput grow={grow} ocultar={hide}>
      <Paper elevation={0}>
        <div className={classes.headerContainer}>
          <Typography variant="body1">{`${title} (${value.length})`}</Typography>
          <IconButton onClick={() => setValue([...value, configuration])}>
            <FaPlus />
          </IconButton>
        </div>
        <Formulario fields={fields} />
      </Paper>
    </BaseInput>
  )
}

const useClasses = makeStyles(() => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))
