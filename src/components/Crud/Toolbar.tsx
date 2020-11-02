import React, { ReactNode } from 'react'
import { Button, Collapse, Divider, makeStyles, Typography } from '@material-ui/core'
import { FaFilter } from 'react-icons/fa'
import { useLang } from '../../utils/CrudContext'
import { useABM } from '../../utils/DataContext'
import Form from '../Form'
import { ActionProps } from '../Table/TableTypes'

interface Props {
  editObj: object | null
  noTitle?: boolean
  Left?: ReactNode
  loading?: boolean
  title?: string
  gender?: 'M' | 'F'
  show: boolean
  handleShow: () => void
  onFilter: (filters: object) => void
  onNew: () => void
  titleSize?: number
  name: string
  hide: boolean
}

export default (props: Props) => {
  const lang = useLang()
  const { editObj, noTitle, Left, loading, title, gender, hide } = props
  const { show, handleShow, onNew, onFilter, titleSize, name } = props
  const { filters, fields } = useABM()
  const classes = useClasses({ titleSize })

  if (hide) return null

  return (
    <React.Fragment>
      <Collapse in={!editObj} timeout="auto" unmountOnExit>
        <div className={classes.root}>
          {noTitle ? (
            <div />
          ) : (
            <div className={classes.leftComponent}>
              {Left && <div hidden={loading}>{Left}</div>}
              <Typography gutterBottom={false} variant="h1" className={classes.title}>{`${
                show ? lang.filter : title || lang.listOf
              } ${title ? '' : name}`}</Typography>
            </div>
          )}
          <div>
            {Object.keys(filters || []).length > 0 && (
              <Button
                color="primary"
                endIcon={<FaFilter />}
                disabled={!!editObj}
                className={classes.spaceLeft}
                onClick={handleShow}>
                {`${show ? lang.close : lang.open} ${lang.filters}`}
              </Button>
            )}
            {fields && (
              <Button
                disabled={!!editObj}
                color="primary"
                variant="outlined"
                className={classes.spaceLeft}
                onClick={onNew}>
                {`${lang.add}${gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''} ${name}`}
              </Button>
            )}
          </div>
        </div>
        {filters && (
          <Collapse in={show} timeout="auto" unmountOnExit>
            <Form inline accept={lang.filter} fields={filters} onSubmit={onFilter} noValidate />
          </Collapse>
        )}
      </Collapse>
      <Divider className={classes.divisor} />
    </React.Fragment>
  )
}

const useClasses = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  leftComponent: {
    display: 'flex',
    alignItems: 'center',
  },
  title: ({ titleSize }: any) => ({
    fontSize: titleSize || 26,
  }),
  spaceLeft: {
    marginLeft: theme.spacing(2),
  },
  divisor: {
    marginBottom: theme.spacing(3),
  },
}))
