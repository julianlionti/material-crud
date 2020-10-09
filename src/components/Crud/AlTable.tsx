export default () => {
  return null
}

// import React, { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
// import {
//   Checkbox,
//   Collapse,
//   IconButton,
//   lighten,
//   LinearProgress,
//   makeStyles,
//   Paper,
//   TableRow,
//   Tooltip,
//   Typography,
// } from '@material-ui/core'
// import 'react-virtualized/styles.css'
// import { PaginationProps, useABM } from '../../utils/DataContext'
// import { Table, Column, AutoSizer, RowMouseEventHandlerParams } from 'react-virtualized'
// import { FaEdit, FaTrash } from 'react-icons/fa'
// import { CamposProps } from '../Form'
// import CustomHeader from './CustomHeader'
// import CustomCell, { FieldAndColProps } from './CustomCell'
// import Pagination from './Pagination'
// import { SortProps } from './Sort'
// import { useLang } from '../../utils/CrudContext'

// export interface TableProps {
//   height: number
//   columns?: CamposProps[]
//   onRowClick?: (row: RowMouseEventHandlerParams) => void
//   headerHeight?: number
//   rowHeight?: number
//   edit?: boolean
//   onEdit?: (row: any) => void
//   deleteRow?: boolean
//   onDelete?: (row: any) => void
//   hideSelecting?: boolean
//   rightToolbar?: (props: {
//     rowsSelected: any[]
//     list: any[]
//     deleteCall: (id: any) => void
//     editCall: (id: any, item: any) => void
//     clearSelected: () => void
//   }) => ReactNode
//   // actionsLabel?: string
// }

// interface Props extends TableProps {
//   loading?: boolean
//   columns: CamposProps[]
//   rows: any[]
//   onEdit: (row: any) => void
//   onDelete: (row: any) => void
//   headerClassName?: string
//   onChangePagination: (page: number, perPage: number) => void
//   onSort: (sort: SortProps) => void
// }

// export default memo((props: Props) => {
//   /*
//   const {
//     columns,
//     rows,
//     height,
//     onRowClick,
//     edit,
//     deleteRow,
//     onDelete,
//     onEdit,
//     rowHeight,
//     headerHeight,
//     headerClassName,
//     onChangePagination,
//     loading,
//     onSort,
//     hideSelecting,
//     rightToolbar,
//   } = props
//   const lang = useLang()
//   const finalRowHeight = useMemo(() => rowHeight || 48, [rowHeight])

//   const { list, deleteCall, edit: editCall, itemId } = useABM()
//   const [rowsSelected, setRowSelected] = useState<any[]>([])

//   const classes = useClasses({
//     height,
//     finalRowHeight,
//     rowsLength: rows.length,
//     toolbar: rowsSelected.length > 0,
//   })

//   const finalColumns = useMemo(
//     () =>
//       columns!
//         .flat()
//         .filter((e) => e.list)
//         .map((e): FieldAndColProps => ({ ...e, title: e.title || '', ...e.list!! })),
//     [columns],
//   )

//   const handleSelectRow = useCallback(
//     (item: any) =>
//       setRowSelected((acc) => {
//         const i = acc.findIndex((x) => x[itemId!!] === item[itemId!!])
//         if (i >= 0) return acc.filter((_, index) => index !== i)
//         else return [...acc, item]
//       }),
//     [itemId],
//   )

//   const clearSelected = useCallback(() => setRowSelected([]), [setRowSelected])
// */
//   return null
//   /* return (
//     <div>
//       <Collapse timeout="auto" in={rowsSelected.length > 0} unmountOnExit>
//         <Paper elevation={5} className={classes.selected}>
//           <Typography
//             style={{ flex: 1 }}
//             color="inherit"
//             variant="subtitle1"
//             component="div">
//             {rowsSelected.length} {lang?.selected}
//           </Typography>
//           {rightToolbar &&
//             rightToolbar({ rowsSelected, list, deleteCall, editCall, clearSelected })}
//         </Paper>
//       </Collapse>
//       <Paper elevation={5} className={classes.container}>
//         <Collapse timeout="auto" in={loading} unmountOnExit>
//           <LinearProgress />
//         </Collapse>
//         <AutoSizer>
//           {({ height, width }) => (
//             <div>
//               <Table
//                 onRowClick={onRowClick}
//                 rowGetter={({ index }) => rows[index]}
//                 height={height - 50}
//                 width={width}
//                 headerHeight={headerHeight || 54}
//                 rowCount={rows?.length || 0}
//                 rowHeight={finalRowHeight}
//                 rowClassName={({ index }) =>
//                   index % 2 === 0 ? classes.tableRowOdd : classes.tableRow
//                 }
//                 headerRowRenderer={({ className, style, columns }) => (
//                   <div
//                     className={`${className} ${headerClassName}`}
//                     role="row"
//                     style={style}>
//                     {columns}
//                   </div>
//                 )}>
//                 {!hideSelecting && (
//                   <Column
//                     headerRenderer={() => (
//                       <CustomHeader col={{ align: 'center' }} dataKey="">
//                         <Checkbox
//                           indeterminate={
//                             rowsSelected.length > 0 && rowsSelected.length < rows.length
//                           }
//                           checked={rows.length > 0 && rowsSelected.length === rows.length}
//                           onChange={(e, checked) => setRowSelected(checked ? rows : [])}
//                         />
//                       </CustomHeader>
//                     )}
//                     width={(width * 5) / 100}
//                     cellRenderer={({ rowData }) => (
//                       <CustomCell col={{ align: 'center' }} rowHeight={finalRowHeight}>
//                         <Checkbox
//                           checked={rowsSelected.some(
//                             (x) => x[itemId!!] === rowData[itemId!!],
//                           )}
//                           onChange={() => handleSelectRow(rowData)}
//                         />
//                       </CustomCell>
//                     )}
//                     dataKey=""
//                   />
//                 )}
//                 {finalColumns.map((col, index) => (
//                   <Column
//                     headerRenderer={(props) => (
//                       <CustomHeader onSort={onSort} col={col} {...props} />
//                     )}
//                     cellRenderer={(props) => (
//                       <CustomCell col={col} rowHeight={finalRowHeight} {...props} />
//                     )}
//                     dataKey={col.id}
//                     key={col.id}
//                     flexGrow={
//                       !edit && !deleteRow && finalColumns.length - 1 === index ? 1 : 0
//                     }
//                     width={
//                       col.width ? (width * col.width) / 100 : width / finalColumns.length
//                     }
//                   />
//                 ))}
//                 {(deleteRow || edit) && (
//                   <Column
//                     headerRenderer={(props) => (
//                       <CustomHeader
//                         col={{ title: lang?.crudCol || 'CRUD', align: 'flex-end' }}
//                         {...props}
//                       />
//                     )}
//                     width={(width * 10) / 100}
//                     flexGrow={1}
//                     cellRenderer={({ rowData }) => (
//                       <CustomCell rowHeight={finalRowHeight}>
//                         <div>
//                           {deleteRow && (
//                             <Tooltip title="Delete">
//                               <IconButton size="small" onClick={() => onDelete(rowData)}>
//                                 <FaTrash />
//                               </IconButton>
//                             </Tooltip>
//                           )}
//                           {edit && (
//                             <Tooltip title="Edit">
//                               <IconButton size="small" onClick={() => onEdit(rowData)}>
//                                 <FaEdit />
//                               </IconButton>
//                             </Tooltip>
//                           )}
//                         </div>
//                       </CustomCell>
//                     )}
//                     dataKey=""
//                   />
//                 )}
//               </Table>
//               <Pagination width={width} onChange={onChangePagination} />
//             </div>
//           )}
//         </AutoSizer>
//       </Paper>
//     </div>
//   ) */
// })

// const useClasses = makeStyles((theme) => ({
//   container: ({ height, finalRowHeight, rowsLength, toolbar }: any) => ({
//     margin: 'auto',
//     width: '100%',
//     height: finalRowHeight * rowsLength + 115,
//     minHeight: 250,
//     maxHeight: height,
//   }),
//   tableRow: {},
//   tableRowOdd: {
//     backgroundColor: theme.palette.grey[100],
//   },
//   selected: {
//     display: 'flex',
//     flexDirection: 'row',
//     flex: 1,
//     alignItems: 'center',
//     height: 20,
//     marginBottom: 4,
//     color: theme.palette.secondary.main,
//     backgroundColor: lighten(theme.palette.secondary.light, 0.85),
//     padding: theme.spacing(2),
//   },
// }))
