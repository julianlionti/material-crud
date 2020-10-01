import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Types, Crud, CrudProps, CrudProvider } from 'material-crud'
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa'
import { Button, Card, CardActions, CardContent, IconButton } from '@material-ui/core'
import { english } from './lang'

interface Categoria extends CrudProps {
  id: string
  type: string
  creation_date: string
  options: { name: string; value: string }[]
  requiereNormativa?: boolean
  normativas: { nombre: string }[]
}

const ItemCategoria = ({ id, type, creation_date, onDelete, onEdit }: Categoria) => {
  return (
    <Card style={{ flex: 1, minWidth: 260, maxWidth: 260, height: 150, margin: 8 }}>
      <CardContent>
        <p>ID: {id}</p>
        <p>Type: {type}</p>
        <p>Creation Date: {creation_date}</p>
      </CardContent>
      <CardActions>
        <Button onClick={onDelete}>Borrar</Button>
        <Button onClick={onEdit}>Editar</Button>
      </CardActions>
    </Card>
  )
}

export default () => {
  const history = useHistory()

  useEffect(() => {
    return () => {}
  }, [])

  return (
    <CrudProvider>
      <Crud
        Left={
          <IconButton color="inherit" onClick={() => history.push('/')}>
            <FaArrowLeft />
          </IconButton>
        }
        table={{
          columns: [
            { id: 'username', title: 'Usuario', width: 20 },
            { id: 'name', title: 'Nombre', width: 20 },
            { id: 'surname', title: 'Apellido', width: 20 },
            { id: 'phone', title: 'Teléfono', width: 20, numeric: true },
            { id: 'email', title: 'Mail', width: 20 },
            {
              id: 'acciones',
              title: 'Acciones',
              width: 20,
              component: (rowData: any) => (
                <div>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => console.log(rowData)}>
                    <FaTrash />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={() => console.log(rowData)}>
                    <FaEdit />
                  </IconButton>
                </div>
              ),
              align: 'right',
            },
          ],
          height: 400,
          // onRowClick: (row) => console.log(row),
        }}
        lang={english}
        fields={[
          {
            id: 'nombre',
            title: 'Nombre',
            placeholder: 'Nombre de la categoría',
            type: Types.Input,
            filter: true,
            sort: true,
          },
          {
            id: 'descripcion',
            title: 'Descripción',
            placeholder: 'Descripción de la categoría',
            type: Types.Multiline,
            filter: true,
            sort: true,
          },
          {
            id: 'requiereNormativa',
            type: Types.Switch,
            title: 'Requiere normativa',
          },
          {
            id: 'normativas',
            type: Types.Multiple,
            title: 'Normativas necesarias',
            depends: ({ requiereNormativa }: Categoria) => requiereNormativa === true,
            configuration: [
              { type: Types.Input, title: 'Nombre', id: 'prueba' },
              {
                type: Types.Options,
                title: 'Tipo',
                id: 'tipo',
                options: [
                  { id: '1', title: 'Empire' },
                  { id: '2', title: 'OTRO' },
                ],
                placeholder: 'Select one',
              },
              { type: Types.Number, title: 'Cantidad', id: 'cantidad' },
            ],
          },
        ]}
        description="Crud example"
        name="Camiseta"
        url="http://localhost:5050/api/user"
        renderItem={(props: Categoria) => <ItemCategoria {...props} />}
        onError={(err) => console.log(err)}
        response={{
          list: (response) => ({
            items: response.data.docs,
            page: 1,
            hasNextPage: false,
            totalDocs: 0,
            totalPages: 1,
          }),
          new: 'item',
          edit: { item: 'item', id: '_id' },
          delete: { item: 'borrado', id: '_id' },
        }}
        interaction={{
          page: 'page',
          perPage: 'perPage',
          filter: 'filter',
          sort: 'sort',
        }}
        itemId="id"
      />
    </CrudProvider>
  )
}
