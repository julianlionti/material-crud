import React, { memo, useMemo } from 'react'
import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import { useField } from 'formik'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { TodosProps } from '.'
import AlAutocomplete from './AlAutocomplete'
import AlCustom from './AlCustom'
import AlImagen from './AlImagen'
import AlInput from './AlInput'
import AlSelect from './AlSelect'
import AlSwitch from './AlSwitch'
import BaseInput from './BaseInput'
import { FormTypes, ComunesProps } from './FormTypes'
import { multipleDefault } from './helpers'

type ValuesProps = { [key: string]: any }

export interface AlMultipleProps extends ComunesProps {
  type: FormTypes.Multiple
  configuration: TodosProps[]
}

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
            onClick={() => setValue([...valFinal, multipleDefault(configuration)])}>
            <FaPlus />
          </IconButton>
        </div>
        {valFinal.map((_, index) => (
          <div key={index} className={classes.horizontal}>
            {configuration.flat().map(({ id: colId, ...etc }) => {
              switch (etc.type) {
                case FormTypes.Input:
                case FormTypes.Email:
                case FormTypes.Multiline:
                case FormTypes.Number:
                case FormTypes.Phone:
                  return (
                    <AlInput
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case FormTypes.Options:
                  return (
                    <AlSelect
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case FormTypes.Image:
                  return (
                    <AlImagen
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case FormTypes.Autocomplete:
                  return (
                    <AlAutocomplete
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case FormTypes.Switch:
                  return (
                    <AlSwitch
                      loading={loading}
                      id={`${id}.${index}.${colId}`}
                      key={colId}
                      {...etc}
                    />
                  )
                case FormTypes.Custom:
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
