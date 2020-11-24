import React, { memo, useMemo } from 'react'
import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import { useField } from 'formik'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { compareKeys } from '../../utils/addOns'
import AlAutocomplete from './AlAutocomplete'
import AlCustom from './AlCustom'
import AlImagen from './AlImagen'
import AlInput from './AlInput'
import AlOnlyTitle from './AlOnlyTitle'
import AlSelect from './AlSelect'
import AlSwitch from './AlSwitch'
import BaseInput from './BaseInput'
import { FormTypes, ComunesProps, AllInputTypes } from './FormTypes'
import { multipleDefault } from './helpers'

type ValuesProps = { [key: string]: any }

export interface AlMultipleProps extends ComunesProps {
  type: FormTypes.Multiple
  configuration: AllInputTypes[]
}

export default memo((props: AlMultipleProps) => {
  const { id, title, grow, hide, configuration, loading, keepMounted } = props
  const [{ value }, { error }, { setValue }] = useField<ValuesProps[]>(id)
  const classes = useClasses()

  const isOnlyTitle = useMemo(
    () => configuration.length === 1 && configuration[0].type === FormTypes.OnlyTitle,
    [configuration],
  )
  const valFinal = useMemo(() => value || [], [value])

  return (
    <BaseInput grow={grow} ocultar={hide} keepMounted={keepMounted}>
      <Paper elevation={0}>
        <div className={classes.headerContainer}>
          <Typography variant="body1">{`${title} (${valFinal?.length})`}</Typography>
          {!isOnlyTitle && (
            <IconButton
              disabled={loading}
              onClick={() => setValue([...valFinal, multipleDefault(configuration)])}>
              <FaPlus />
            </IconButton>
          )}
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
                case FormTypes.OnlyTitle:
                  return <AlOnlyTitle id={`${id}.${index}.${colId}`} key={colId} {...etc} />
                default:
                  return null
              }
            })}
            {!isOnlyTitle && (
              <IconButton
                disabled={loading}
                onClick={() => setValue(valFinal.filter((_, i) => i !== index))}>
                <FaTrash />
              </IconButton>
            )}
          </div>
        ))}
        {error && <Typography className={classes.error}>{error}</Typography>}
      </Paper>
    </BaseInput>
  )
}, compareKeys(['loading', 'configuration', 'hide']))

const useClasses = makeStyles((theme) => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontal: {
    display: 'flex',
  },
  error: {
    color: theme.palette.error.main,
  },
}))
