import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import { useField } from 'formik'
import React, { memo, useMemo } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import BaseInput from './BaseInput'
import AlInput from './AlInput'
import { Types, ComunesProps } from './Types'
import { generateDefault, TodosProps } from '.'
import AlSelect from './AlSelect'
import AlImagen from './AlImagen'
import AlAutocomplete from './AlAutocomplete'
import AlSwitch from './AlSwitch'
import AlCustom from './AlCustom'

type ValuesProps = { [key: string]: any }

export interface AlMultipleProps extends ComunesProps {
  type: Types.Multiple
  configuration: TodosProps[]
}

export const valDefault = (conf: TodosProps[]) =>
  conf.flat().reduce((acc, it) => ({ ...acc, [it.id]: generateDefault(it) }), {})

export default memo((props: AlMultipleProps) => {
  const { id, title, grow, hide, configuration, loading } = props
  const [{ value }, { error }, { setValue }] = useField<ValuesProps[]>(id)
  const classes = useClasses()

  const valFinal = useMemo(() => value || [], [value])

  return (
    <BaseInput grow={grow} ocultar={hide}>
      <Paper elevation={0}>
        <div className={classes.headerContainer}>
          <Typography variant="body1">{`${title} (${valFinal?.length})`}</Typography>
          <IconButton
            disabled={loading}
            onClick={() => setValue([...valFinal, valDefault(configuration)])}>
            <FaPlus />
          </IconButton>
        </div>
        {valFinal.map((_, index) => (
          <div key={index} className={classes.horizontal}>
            {configuration.flat().map(({ id: colId, ...etc }) => {
              switch (etc.type) {
                case Types.Input:
                case Types.Email:
                case Types.Multiline:
                case Types.Number:
                case Types.Phone:
                  return (
                    <AlInput
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case Types.Options:
                  return (
                    <AlSelect
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case Types.Image:
                  return (
                    <AlImagen
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case Types.Autocomplete:
                  return (
                    <AlAutocomplete
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case Types.Switch:
                  return (
                    <AlSwitch
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case Types.Custom:
                  return (
                    <AlCustom
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                default:
                  return null
              }
            })}
            <IconButton
              disabled={loading}
              onClick={() => setValue(valFinal.filter((_, i) => i !== index))}>
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
