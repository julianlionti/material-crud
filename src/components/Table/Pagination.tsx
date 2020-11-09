import React, { memo } from 'react'
import { Collapse, makeStyles, MenuItem, Select, Typography } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import { useLang } from '../../utils/CrudContext'
import { useABM } from '../../utils/DataContext'

interface Props {
  onChange: (page: number, perPage: number) => void
  loading?: boolean
}

const perPageList = [5, 10, 15, 50, 100, 500, 1000]

export default memo(({ onChange, loading }: Props) => {
  const { pagination } = useABM()
  const { page, limit, totalDocs, totalPages } = pagination
  const lang = useLang()
  const classes = useClasses()

  if (!lang.pagination) return <Typography>Hace falta 'lang.pagination'</Typography>

  return (
    <div style={{ width: '100%' }} className={classes.pagContainer}>
      <Collapse in={!!totalDocs} timeout="auto">
        <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
          <Typography>{`${lang.pagination.totalCount} ${totalDocs} - ${lang.pagination.rowsPerPage}:`}</Typography>
          <Select
            disabled={loading}
            className={classes.perPage}
            value={limit}
            onChange={({ target }) => onChange(page, target.value as number)}>
            {perPageList.map((e) => (
              <MenuItem key={e} value={e}>
                {String(e)}
              </MenuItem>
            ))}
            <MenuItem value={-1}>{lang.pagination.all}</MenuItem>
          </Select>
        </div>
      </Collapse>
      <Pagination
        disabled={loading}
        color="primary"
        variant="outlined"
        className={classes.pagination}
        count={totalPages}
        page={page}
        onChange={(_, p) => onChange(p, limit || 10)}
        siblingCount={1}
        showFirstButton
        showLastButton
      />
    </div>
  )
})

const useClasses = makeStyles((theme) => ({
  pagContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      backgroundColor: 'red',
    },
  },
  perPage: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    width: 80,
    textAlign: 'center',
  },
  pagination: {},
}))
