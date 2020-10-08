import { Collapse, makeStyles, MenuItem, Select, Typography } from '@material-ui/core'
import React, { memo } from 'react'
import Pagination from '@material-ui/lab/Pagination'
import { useLang } from '../../utils/CrudContext'
import { useABM } from '../../utils/DataContext'

interface Props {
  width: number
  onChange: (page: number, perPage: number) => void
}

const perPageList = [5, 10, 15, 50, 100, 500, 1000]

export default memo(({ width, onChange }: Props) => {
  const { pagination } = useABM()
  const { page, limit, totalDocs, totalPages } = pagination
  const lang = useLang()
  const classes = useClasses()

  return (
    <div style={{ width: width - 10 }} className={classes.pagContainer}>
      <Collapse in={!!totalDocs} timeout="auto">
        <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
          <Typography>{`${lang?.pagination?.totalCount} ${totalDocs} - ${lang?.pagination?.rowsPerPage}:`}</Typography>
          <Select
            className={classes.perPage}
            value={limit}
            onChange={({ target }) => onChange(page, target.value as number)}>
            {perPageList.map((e) => (
              <MenuItem key={e} value={e}>
                {String(e)}
              </MenuItem>
            ))}
            <MenuItem value={-1}>Todos</MenuItem>
          </Select>
        </div>
      </Collapse>
      <Pagination
        color="primary"
        variant="outlined"
        className={classes.pagination}
        count={totalPages}
        page={page}
        onChange={(e, p) => onChange(p, limit!!)}
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
