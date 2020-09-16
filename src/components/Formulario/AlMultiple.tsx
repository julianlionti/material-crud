import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import { useField } from 'formik'
import React, { useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import Formulario, { ComunesProps, Tipos, TodosProps } from '.'
import BaseInput from './BaseInput'

type ConfProps = { [key: string]: { tipo: Tipos; title: string } }

export interface AlMultipleProps extends ComunesProps {
  tipo: Tipos.Multiple
  configuration: ConfProps
}

export default (props: AlMultipleProps) => {
  const { id, titulo, grow, ocultar, configuration } = props
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
    <BaseInput grow={grow} ocultar={ocultar}>
      <Paper elevation={0}>
        <div className={classes.headerContainer}>
          <Typography variant="body1">{`${titulo} (${value.length})`}</Typography>
          <IconButton onClick={() => setValue([...value, configuration])}>
            <FaPlus />
          </IconButton>
        </div>
        <Formulario campos={fields}></Formulario>
      </Paper>
    </BaseInput>
  )
}

const useClasses = makeStyles((theme) => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))
