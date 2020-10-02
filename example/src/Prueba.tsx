import React, { useCallback, useEffect } from 'react'
import {
  CssBaseline,
  IconButton,
  makeStyles,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Typography,
  Select,
  MenuItem,
} from '@material-ui/core'
import 'react-virtualized/styles.css'
import {
  Table,
  Column,
  AutoSizer,
  TableCellProps,
  TableCellRenderer,
  TableHeaderProps,
} from 'react-virtualized'
import { createFields, Types, useAxios } from 'material-crud'
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { TodosProps } from '../../dist/components/Form'
import Pagination from '@material-ui/lab/Pagination'

const columns = createFields(() => [
  { id: 'nombre', title: 'Usuario', type: Types.Input, list: { width: 20 } },
  { id: 'descripcion', title: 'Nombre', type: Types.Input, list: { width: 20 } },
  {
    id: 'requiereNormativa',
    title: 'Requiere Normativas',
    type: Types.Switch,
    list: { width: 20 },
  },
  {
    id: 'normativas',
    type: Types.Multiple,
    title: 'Normativas necesarias',
    configuration: [
      {
        id: 'normativa',
        type: Types.Input,
        title: 'Normativa necesaria',
        placeholder: 'Nombre de la normativa vigente',
      },
    ],
    list: { width: 20 },
  },
])

const Header = ({
  title,
  className,
}: TableHeaderProps & { title: string; className?: string }) => {
  const classes = useClasses()
  return (
    <TableCell component="div" variant="head" className={className}>
      {title}
    </TableCell>
  )
}

const Cell = ({
  cellData,
  rowData,
  rowHeight,
  col,
}: TableCellProps & { rowHeight: number; col: TodosProps }) => {
  const classes = useClasses({ rowHeight })

  const renderContent = useCallback(() => {
    switch (col.type) {
      case Types.Switch:
        return cellData ? (
          <FaCheck size={18} color="green" />
        ) : (
          <FaTimes size={18} color="red" />
        )
      default:
        return String(cellData)
    }
  }, [cellData, col.type])

  return (
    <TableCell component="div" variant="body" className={classes.cellContainer}>
      {renderContent()}
    </TableCell>
  )
}

export default (props: any) => {
  const {
    onRowClick,
    edit,
    deleteRow,
    onDelete,
    onEdit,
    rowHeight,
    headerHeight,
    actionsLabel,
    headerClassName,
  } = props
  const { response, call } = useAxios<any>()
  const { data } = response || {}
  const { docs } = data || []

  const classes = useClasses({ height: 500 })

  useEffect(() => {
    call({
      url: 'http://localhost:5050/api/categoria',
      params: { pagina: 1, porPagina: 5 },
    })
  })

  const finalColumns = columns!
    .flat()
    .filter((e: any) => e.list)
    .map((e: any) => ({ ...e, title: e.title || '', ...e.list!! }))

  return (
    <div>
      <CssBaseline />
      <div style={{ marginTop: 16 }}></div>
      <Paper elevation={5} className={classes.container}>
        <AutoSizer>
          {({ height, width }) => (
            <div>
              <Table
                // gridStyle={{outline:"none"}}
                onRowClick={onRowClick}
                rowGetter={({ index }) => docs[index]}
                height={height - 50}
                width={width}
                headerHeight={headerHeight || 54}
                rowCount={docs?.length || 0}
                rowHeight={rowHeight || 48}
                rowClassName={({ index }) =>
                  index % 2 === 0 ? classes.tableRowHover : classes.tableRow
                }
                headerRowRenderer={({ className, style, columns }) => (
                  <div
                    className={`${className} ${headerClassName}`}
                    role="row"
                    style={style}>
                    {columns}
                  </div>
                )}>
                {finalColumns.map((col, index) => (
                  <Column
                    headerRenderer={(props) => <Header title={col.title} {...props} />}
                    cellRenderer={(props) => (
                      <Cell col={col} rowHeight={rowHeight} {...props} />
                    )}
                    dataKey={col.id}
                    key={col.id}
                    flexGrow={
                      !edit && !deleteRow && finalColumns.length - 1 === index ? 1 : 0
                    }
                    width={
                      col.width ? (width * col.width) / 100 : width / finalColumns.length
                    }
                  />
                ))}
                {(edit || deleteRow) && (
                  <Column
                    headerRenderer={(props) => (
                      <Header
                        className={`${classes.cellContainer} ${classes.right}`}
                        title={actionsLabel || 'CRUD'}
                        {...props}
                      />
                    )}
                    width={(width * 10) / 100}
                    flexGrow={1}
                    cellRenderer={({ rowData }) => (
                      <TableCell
                        variant="body"
                        component="div"
                        className={`${classes.cellContainer} ${classes.right}`}>
                        <div>
                          {deleteRow && (
                            <IconButton
                              size="small"
                              onClick={() => {
                                if (onDelete) onDelete(rowData)
                              }}>
                              <FaTrash />
                            </IconButton>
                          )}
                          {edit && (
                            <IconButton
                              size="small"
                              onClick={() => {
                                if (onEdit) onEdit(rowData)
                              }}>
                              <FaEdit />
                            </IconButton>
                          )}
                        </div>
                      </TableCell>
                    )}
                    dataKey=""
                  />
                )}
              </Table>
              <Divider variant="fullWidth" />
              <div style={{ width: width - 10 }} className={classes.pagContainer}>
                <Typography>Registros por página:</Typography>
                <Select className={classes.perPage} value={5} onChange={() => {}}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={500}>500</MenuItem>
                  <MenuItem value={1000}>1000</MenuItem>
                  <MenuItem value={-1}>Todos</MenuItem>
                </Select>
                <Pagination
                  color="primary"
                  variant="outlined"
                  className={classes.pagination}
                  count={11}
                  defaultPage={6}
                  siblingCount={1}
                  showFirstButton
                  showLastButton
                />
              </div>
            </div>
          )}
        </AutoSizer>
      </Paper>
    </div>
  )
}

const useClasses = makeStyles((theme) => ({
  container: ({ height }: any) => ({
    margin: 'auto',
    width: '95%',
    height,
  }),
  header: {
    backgroundColor: 'red',
  },
  cellContainer: ({ rowHeight }: any) => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    height: rowHeight,
  }),
  tableRow: {},
  tableRowHover: {
    backgroundColor: theme.palette.grey[100],
  },
  right: {
    justifyContent: 'flex-end',
  },
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
