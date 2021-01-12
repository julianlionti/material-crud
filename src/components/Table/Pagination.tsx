import React, { memo } from 'react'
import { Box, Collapse, makeStyles, MenuItem, Select, Typography } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import { compareKeysOmit } from '../../utils/addOns'
import AriaLabels from '../../utils/AriaLabels'
import { useLang } from '../../utils/CrudContext'
import { useABM } from '../../utils/DataContext'

interface Props {
  onChange: (page: number, perPage: number) => void
  loading?: boolean
}

export const perPageList = [5, 10, 15, 50, 100, 500, 1000]

export default memo(({ onChange, loading }: Props) => {
  const { pagination, list } = useABM()
  const { page, limit, totalDocs, totalPages } = pagination
  const lang = useLang()
  const classes = useClasses()

  if (!lang.pagination) return <Typography>Hace falta 'lang.pagination'</Typography>

  return (
    <div className={classes.pagContainer}>
      <Collapse in={!!totalDocs} timeout="auto">
        <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
          <Typography component="div" variant="body2">
            {lang.pagination.showing}
            <Box
              aria-valuetext={list.length.toString()}
              aria-label={AriaLabels.Pagination.Docs}
              fontWeight="bold"
              display="inline">
              {` ${list.length} `}
            </Box>
            {` ${lang.pagination.of} `}
            <Box
              aria-valuetext={totalDocs?.toString() || '0'}
              aria-label={AriaLabels.Pagination.TotalDocs}
              fontWeight="bold"
              display="inline">
              {` ${totalDocs} - `}
            </Box>
            {`${lang.pagination.rowsPerPage}: `}
          </Typography>
          <Select
            aria-valuetext={limit?.toString() || '0'}
            aria-label={AriaLabels.Pagination.PerPage}
            disabled={loading}
            className={classes.perPage}
            value={limit}
            variant="outlined"
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
}, compareKeysOmit(['onChange']))

const useClasses = makeStyles((theme) => ({
  pagContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      height: 100,
      justifyContent: 'center',
      paddingRight: theme.spacing(0),
      paddingLeft: theme.spacing(0),
    },
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  perPage: {
    width: 80,
    height: 34,
    textAlign: 'center',
  },
  pagination: {},
}))
