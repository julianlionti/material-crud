import { makeStyles, MenuItem, Select, Typography } from '@material-ui/core'
import React from 'react'
import Pagination from '@material-ui/lab/Pagination'
import { PaginationProps } from './AlTable'

interface Props extends PaginationProps {
  width: number
  onChange: (page: number, perPage: number) => void
}

const perPageList = [5, 10, 15, 50, 100, 500, 1000]

export default (props: Props) => {
  const { width, page, limit, onChange, totalDocs, totalPages } = props
  const classes = useClasses()

  console.log(page, limit)
  return (
    <div style={{ width: width - 10 }} className={classes.pagContainer}>
      <Typography>Total de registros {totalDocs} - </Typography>
      <Typography> Registros por página:</Typography>
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
      <Pagination
        color="primary"
        variant="outlined"
        className={classes.pagination}
        count={totalPages}
        page={page}
        onChange={(e, p) => {
          console.log(p)
          onChange(p, limit!!)
        }}
        siblingCount={1}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

const useClasses = makeStyles((theme) => ({
  pagContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
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
