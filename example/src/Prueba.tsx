import React, { forwardRef, memo, PropsWithChildren } from 'react'
import { makeStyles, Paper, TableCell } from '@material-ui/core'
import 'react-virtualized/styles.css'
import { Table, Column, AutoSizer } from 'react-virtualized'
import clsx from 'clsx'

const columns = [
  { id: 'username', title: 'Usuario', width: 20 },
  { id: 'name', title: 'Nombre', width: 20 },
  { id: 'surname', title: 'Apellido', width: 20 },
  { id: 'phone', title: 'Teléfono', width: 20, numeric: true },
  { id: 'email', title: 'Mail', width: 20 },
]

const rows = [
  {
    _id: '5f7393ca664482820078188b',
    username: 'eldelapaz',
    name: 'Elizabeth',
    surname: 'Delapaz',
    phone: '521.612.466',
    email: 'eldelapaz@gmail.com',
    admin: false,
    active: false,
    createdAt: '2020-09-29T20:06:34.587Z',
    updatedAt: '2020-09-29T20:06:35.441Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188c',
    username: 'irfrías',
    name: 'Irene',
    surname: 'Frías',
    phone: '5299-828-877',
    email: 'irfrías@gmail.com',
    admin: false,
    active: true,
    createdAt: '2020-09-29T20:06:34.587Z',
    updatedAt: '2020-09-29T20:06:35.441Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188d',
    username: 'vigarcía',
    name: 'Vicente',
    surname: 'García',
    phone: '529353267',
    email: 'vigarcía@gmail.com',
    admin: true,
    active: false,
    createdAt: '2020-09-29T20:06:34.587Z',
    updatedAt: '2020-09-29T20:06:35.442Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188e',
    username: 'naleón',
    name: 'Natalia',
    surname: 'León',
    phone: '562 747 723',
    email: 'naleón@gmail.com',
    admin: false,
    active: false,
    createdAt: '2020-09-29T20:06:34.587Z',
    updatedAt: '2020-09-29T20:06:35.442Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188a',
    username: 'macordero',
    name: 'Marisol',
    surname: 'Cordero',
    phone: '557.111.395',
    email: 'macordero@gmail.com',
    admin: true,
    active: false,
    createdAt: '2020-09-29T20:06:34.586Z',
    updatedAt: '2020-09-29T20:06:35.438Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188a',
    username: 'macordero',
    name: 'Marisol',
    surname: 'Cordero',
    phone: '557.111.395',
    email: 'macordero@gmail.com',
    admin: true,
    active: false,
    createdAt: '2020-09-29T20:06:34.586Z',
    updatedAt: '2020-09-29T20:06:35.438Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188a',
    username: 'macordero',
    name: 'Marisol',
    surname: 'Cordero',
    phone: '557.111.395',
    email: 'macordero@gmail.com',
    admin: true,
    active: false,
    createdAt: '2020-09-29T20:06:34.586Z',
    updatedAt: '2020-09-29T20:06:35.438Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188a',
    username: 'macordero',
    name: 'Marisol',
    surname: 'Cordero',
    phone: '557.111.395',
    email: 'macordero@gmail.com',
    admin: true,
    active: false,
    createdAt: '2020-09-29T20:06:34.586Z',
    updatedAt: '2020-09-29T20:06:35.438Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188a',
    username: 'macordero',
    name: 'Marisol',
    surname: 'Cordero',
    phone: '557.111.395',
    email: 'macordero@gmail.com',
    admin: true,
    active: false,
    createdAt: '2020-09-29T20:06:34.586Z',
    updatedAt: '2020-09-29T20:06:35.438Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188a',
    username: 'macordero',
    name: 'Marisol',
    surname: 'Cordero',
    phone: '557.111.395',
    email: 'macordero@gmail.com',
    admin: true,
    active: false,
    createdAt: '2020-09-29T20:06:34.586Z',
    updatedAt: '2020-09-29T20:06:35.438Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188a',
    username: 'macordero',
    name: 'Marisol',
    surname: 'Cordero',
    phone: '557.111.395',
    email: 'macordero@gmail.com',
    admin: true,
    active: false,
    createdAt: '2020-09-29T20:06:34.586Z',
    updatedAt: '2020-09-29T20:06:35.438Z',
    __v: 0,
  },
  {
    _id: '5f7393ca664482820078188a',
    username: 'macordero',
    name: 'Marisol',
    surname: 'Cordero',
    phone: '557.111.395',
    email: 'macordero@gmail.com',
    admin: true,
    active: false,
    createdAt: '2020-09-29T20:06:34.586Z',
    updatedAt: '2020-09-29T20:06:35.438Z',
    __v: 0,
  },
]

export default () => {
  const classes = useClasses()

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <Table
          height={500}
          width={width}
          rowGetter={({ index }) => rows[index]}
          rowHeight={60}
          headerHeight={60}
          rowCount={rows.length}
          headerClassName={classes.rowHeader}
          rowClassName={clsx(classes.flexContainer, classes.row, classes.noClick)}>
          {columns.map((col, index) => (
            <Column
              key={col.id}
              width={(width * col.width) / 100}
              headerRenderer={({ dataKey }) => (
                <TableCell
                  variant="head"
                  component="div"
                  className={clsx(classes.tableCell, classes.flexContainer)}
                  align={columns[index].numeric || false ? 'right' : 'left'}>
                  {dataKey}
                </TableCell>
              )}
              cellRenderer={({ cellData, columnIndex, rowData }) => (
                <TableCell
                  variant="body"
                  component="div"
                  className={clsx(classes.tableCell, classes.flexContainer)}
                  align={
                    (columnIndex != null && columns[columnIndex].numeric) || false
                      ? 'right'
                      : 'left'
                  }>
                  {cellData}
                </TableCell>
              )}
              dataKey={col.id}
            />
          ))}
        </Table>
      )}
    </AutoSizer>
  )
}

const useClasses = makeStyles((theme) => ({
  table: {
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableCell: {
    flex: 1,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  row: {},
  rowHeader: {
    margin: 0,
    backgroundColor: 'lightblue',
  },
  noClick: {
    cursor: 'initial',
  },
}))
