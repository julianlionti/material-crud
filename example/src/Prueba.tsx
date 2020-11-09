import React from 'react'
import { createFields, FormTypes, Crud } from 'material-crud'
import { Paper, TableRow, TableCell } from '@material-ui/core'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'

const fakeData = Array(600)
  .fill(null)
  .map((e, i) => {
    return {
      nombre: 'nombre ' + i,
      descripcion: 'descripcion ' + i,
    }
  })

const columnas = [
  { id: 'nombre', title: 'Nombre' },
  { id: 'descripcion', title: 'Descripcion' },
]

export default () => {
  const description = 'Crud de prueba'
  const name = 'Prueba'
  const url = 'http://localhost:5050/api/categoria'

  console.log(fakeData)
  // const fields = createFields()

  return (
    <Paper style={{ height: 350, display: 'flex', flex: 1, flexDirection: 'column' }}>
      <TableRow style={{ display: 'flex' }} component="div">
        {columnas.map((col) => (
          <TableCell
            style={{ width: col.id === 'nombre' ? '30%' : '70%' }}
            component="div"
            key={col.id}>
            {col.title}
          </TableCell>
        ))}
      </TableRow>
      <AutoSizer>
        {({ height: tableHeight, width }) => (
          <List
            height={tableHeight - 52}
            itemCount={fakeData.length}
            itemSize={() => 52}
            width={width}>
            {({ style, index }) => {
              return (
                <TableRow style={{ ...style, display: 'flex' }} component="div">
                  {columnas.map((col) => (
                    <TableCell
                      style={{ width: col.id === 'nombre' ? '30%' : '70%' }}
                      component="div"
                      align="right"
                      key={fakeData[index][col.id]}>
                      {fakeData[index][col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              )
            }}
          </List>
        )}
      </AutoSizer>
    </Paper>
  )
}
