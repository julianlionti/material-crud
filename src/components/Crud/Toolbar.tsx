import React, { memo, ReactNode, useState } from 'react'
import {
  Button,
  Collapse,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { FaEllipsisV, FaFilter } from 'react-icons/fa'
import { compareKeysOmit } from '../../utils/addOns'
import { useLang } from '../../utils/CrudContext'
import Form from '../Form'
import { FieldProps, StepProps } from '../Form/FormTypes'

export interface MoreOptionsProps {
  id: string
  title: string
  icon?: ReactNode
  onClick: () => void
  keepOpen?: boolean
}

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
  filters?: FieldProps[]
  steps?: StepProps[]
  fields?: FieldProps[]
  moreOptions?: MoreOptionsProps[]
  big?: boolean
  noFilterOptions?: boolean
}

export const createMoreOptions = (props: MoreOptionsProps[]) => props

export default memo((props: Props) => {
  const lang = useLang()
  const { editObj, noTitle, Left, loading, title, gender, hide } = props
  const {
    show,
    handleShow,
    onNew,
    onFilter,
    titleSize,
    name,
    fields,
    filters,
    steps,
    moreOptions,
    big,
    noFilterOptions,
  } = props
  const classes = useClasses({ titleSize })
  const [anchorEl, setAnchorEl] = useState<any>(null)

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
          <div className={classes.rightRoot}>
            {Object.keys(filters || []).length > 0 && (
              <Button
                size={big ? 'medium' : 'small'}
                color="primary"
                endIcon={<FaFilter size={16} />}
                disabled={!!editObj || loading}
                className={classes.spaceLeft}
                onClick={handleShow}>
                {`${show ? lang.close : lang.open} ${lang.filters}`}
              </Button>
            )}
            {(fields || steps) && (
              <Button
                size={big ? 'medium' : 'small'}
                disabled={!!editObj || loading}
                color="primary"
                variant="outlined"
                className={classes.spaceLeft}
                onClick={onNew}>
                {`${lang.add}${gender === 'F' ? 'a' : gender === 'M' ? 'o' : ''} ${name}`}
              </Button>
            )}
            {moreOptions && moreOptions.length && (
              <Tooltip title={lang.more}>
                <div>
                  <IconButton
                    className={classes.moreMargin}
                    size={big ? 'medium' : 'small'}
                    disabled={loading}
                    color="primary"
                    onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <FaEllipsisV />
                  </IconButton>
                </div>
              </Tooltip>
            )}
          </div>
        </div>
        {filters && (
          <Collapse in={show} timeout="auto" unmountOnExit>
            <Form
              inline
              accept={lang.filter}
              loading={loading}
              fields={filters}
              onSubmit={onFilter}
              noValidate
              noFilterOptions={noFilterOptions}
            />
          </Collapse>
        )}
      </Collapse>
      <Divider className={classes.divisor} />
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}>
        {moreOptions?.map(({ id, title, icon, onClick, keepOpen }, i) => {
          if (!id || !title || !onClick) return <Divider key={i} />
          return (
            <MenuItem
              key={id}
              onClick={() => {
                onClick()
                if (keepOpen) return
                setAnchorEl(null)
              }}>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText>{title}</ListItemText>
            </MenuItem>
          )
        })}
      </Menu>
    </React.Fragment>
  )
}, compareKeysOmit(['handleShow', 'Left', 'onFilter', 'onNew']))

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
  rightRoot: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  moreMargin: {
    marginLeft: theme.spacing(1),
  },
}))
