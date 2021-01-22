import React, { ReactNode, useCallback } from 'react'
import { Card, Chip, Divider, makeStyles, Typography } from '@material-ui/core'

type ValProps = string[] | string | number | boolean | ReactNode
type RenderSectionData = ValProps[][][]
export interface ReadOnlyConf {
  title: string
  section: RenderSectionData
}

interface Props {
  configuration: null | ReadOnlyConf[]
}

export default ({ configuration }: Props) => {
  const classes = useClasses()

  const renderSection = useCallback(
    (title: string, data: RenderSectionData) => {
      const renderVal = (val: ValProps) => {
        if (typeof val === 'boolean') {
          if (val) return <Typography variant="body2">✔</Typography>
          else return <Typography variant="body2">❌</Typography>
        }
        if (Array.isArray(val)) {
          return (
            <ul className={classes.chipRoot}>
              {(val as string[]).map((label) => (
                <li key={label}>
                  <Chip label={label} className={classes.chip} />
                </li>
              ))}
            </ul>
          )
        }
        if (React.isValidElement(val)) return val
        return <Typography variant="body2">{val || '-'}</Typography>
      }

      return (
        <React.Fragment key={title}>
          <Typography className={classes.titulo} variant="h6">
            {`${title}: `}
          </Typography>
          {data.map((inner, i) => (
            <div key={i} className={classes.textRoot}>
              {inner.map((col) => (
                <div key={col[0] as string} className={classes.inner}>
                  <Typography variant="body2" className={classes.titulo}>{`${col[0]}:`}</Typography>
                  {renderVal(col[1])}
                </div>
              ))}
            </div>
          ))}
          <Divider className={classes.spacing} />
        </React.Fragment>
      )
    },
    [classes],
  )

  return (
    <div className={classes.root}>
      <Card variant="outlined" className={classes.cardRoot}>
        {configuration?.map((e) => renderSection(e.title, e.section))}
      </Card>
    </div>
  )
}

const useClasses = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  cardRoot: {
    padding: theme.spacing(2),
  },
  titulo: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  textRoot: {
    display: 'flex',
  },
  inner: {
    flex: 1,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  spacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  chipRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}))
