import React, { forwardRef, ReactNode, useCallback, useImperativeHandle } from 'react'
import { Card, Chip, Divider, makeStyles, Typography } from '@material-ui/core'
import JsPDF from 'jspdf'

type ValProps = string[] | string | number | boolean | ReactNode
type RenderSectionData = ValProps[][][]
export interface ReadOnlyConf {
  title: string
  section: RenderSectionData
}

interface Props {
  sections: null | ReadOnlyConf[]
}

export interface ReadOnlyMethods {
  generatePDF: () => void
}

export default forwardRef<ReadOnlyMethods, Props>(({ sections }, ref) => {
  const classes = useClasses()

  const generatePDF = useCallback(() => {
    const doc = new JsPDF({ unit: 'mm' })
    if (!sections) return

    console.log(sections)
    sections.forEach((sec) => {
      doc.text(sec.title, 10, 10)
      sec.section.forEach((col, i) => {
        const cols = 210 / col.length
        const [title, val] = col
        if (typeof title === 'string') doc.text(title, 10, 30 + 15 * i)
        console.log(col, cols)
      })
      console.log(sec.section)
    })
    doc.save('sarasa.pdf')
  }, [sections])

  useImperativeHandle(ref, () => ({ generatePDF }))

  const renderSection = useCallback(
    (title: string, data: RenderSectionData) => {
      const renderVal = (val: ValProps) => {
        if (typeof val === 'boolean') {
          if (val) return <Typography>✔</Typography>
          else return <Typography>❌</Typography>
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
        return <Typography>{val || '-'}</Typography>
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
                  <Typography className={classes.titulo}>{`${col[0]}:`}</Typography>
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
    <div className={classes.root} id="DetailView">
      <Card variant="outlined" className={classes.cardRoot}>
        {sections?.map((e) => renderSection(e.title, e.section))}
      </Card>
    </div>
  )
})

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
