import { IconButton, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import { useField, FieldArray } from 'formik'
import React, { memo, useEffect, useMemo } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import BaseInput from './BaseInput'
import AlInput, { InputsTypes } from './AlInput'
import { Types, ComunesProps } from './Types'
import { CamposProps, generarDefault, TodosProps } from '.'
import AlSelect from './AlSelect'
import AlImagen from './AlImagen'
import AlAutocomplete from './AlAutocomplete'
import AlSwitch from './AlSwitch'
import AlCustom from './AlCustom'

type ConfProps = { type: TodosProps; title: string; id: string }[]
type ValuesProps = { [key: string]: any }

export interface AlMultipleProps extends ComunesProps {
  type: Types.Multiple
  configuration: CamposProps[]
}

export const valDefault = (conf: CamposProps[]) =>
  conf.flat().reduce((acc, it) => ({ ...acc, [it.id]: generarDefault(it) }), {})

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
          <IconButton onClick={() => setValue([...valFinal, valDefault(configuration)])}>
            <FaPlus />
          </IconButton>
        </div>
        {valFinal.map((_, index) => (
          <div key={index} className={classes.horizontal}>
            {configuration.flat().map((col, i) => {
              switch (col.type) {
                case Types.Input:
                case Types.Email:
                case Types.Multiline:
                case Types.Number:
                case Types.Phone:
                  return <AlInput key={i} {...col} />
                case Types.Options:
                  return <AlSelect key={i} {...col} />
                case Types.Image:
                  return <AlImagen key={i} {...col} />
                case Types.Autocomplete:
                  return <AlAutocomplete key={i} {...col} />
                case Types.Switch:
                  return <AlSwitch key={i} {...col} />
                case Types.Custom:
                  return <AlCustom key={i} {...col} />
                default:
                  return null
              }
            })}
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
