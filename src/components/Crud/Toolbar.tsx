import { Button, Collapse, Divider, makeStyles, Typography } from '@material-ui/core'
import React, { ReactNode, useMemo } from 'react'
import { FaFilter } from 'react-icons/fa'
import { useLang } from '../../utils/CrudContext'
import Form, { CamposProps } from '../Form'
import { Types } from '../Form/Types'
import { ActionProps } from '../Crud/TableWindow'

interface Props {
  editObj: object | null
  noTitle?: boolean
  Left?: ReactNode
  loading?: boolean
  title?: string
  filters: CamposProps[]
  gender?: 'M' | 'F'
  actions?: ActionProps
  show: boolean
  handleShow: () => void
  onFilter: (filters: object) => void
  onNew: () => void
  titleSize?: number
  name: string
}

export default (props: Props) => {
  const lang = useLang()
  const { editObj, noTitle, Left, loading, title, filters, gender, actions } = props
  const { show, handleShow, onNew, onFilter, titleSize, name } = props
  const classes = useClasses({ titleSize })

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
            {Object.keys(filters).length > 0 && (
              <Button
                color="primary"
                endIcon={<FaFilter />}
                disabled={!!editObj}
                className={classes.spaceLeft}
                onClick={handleShow}>
                {`${show ? lang.close : lang.open} ${lang.filters}`}
              </Button>
            )}
            {actions?.new && (
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
