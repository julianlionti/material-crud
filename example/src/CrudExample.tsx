import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Types, Crud, CrudItem, useAxios } from 'material-crud'
import { FaArrowLeft } from 'react-icons/fa'
import { Button, Card, CardActions, CardContent, IconButton } from '@material-ui/core'

interface Categoria extends CrudItem {
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
  const { call, response } = useAxios<any>({})

  useEffect(() => {
    call({
      url: 'http://localhost:5050/api/categoria',
      params: { ordenado: { nombre: 1 } },
    })
  }, [call])

  const { data } = response || {}
  const { docs } = data || {}

  return (
    <Crud
      Left={
        <IconButton color="inherit" onClick={() => history.push('/')}>
          <FaArrowLeft />
        </IconButton>
      }
      // table={{
      //   columns: [
      //     { id: 'username', title: 'Usuario', width: 20 },
      //     { id: 'name', title: 'Nombre', width: 20 },
      //     { id: 'surname', title: 'Apellido', width: 20 },
      //     { id: 'phone', title: 'Teléfono', width: 20 },
      //     { id: 'email', title: 'Mail', width: 20 },
      //     {
      //       id: 'custom',
      //       title: 'Custom',
      //       width: 20,
      //       component: (rowData: any) => <span>CUSTOM</span>,
      //     },
      //   ],
      //   height: 400,
      //   deleteRow: true,
      //   edit: true,
      // }}
      fields={[
        {
          id: 'username',
          title: 'Nombre',
          placeholder: 'Nombre de la categoría',
          type: Types.Input,
          list: {
            width: 20,
            filter: true,
            sort: true,
          },
        },
        {
          id: 'surname',
          title: 'Apellido',
          placeholder: 'Descripción de la categoría',
          type: Types.Multiline,
          list: {
            width: 80,
            filter: true,
            sort: true,
          },
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
        {
          id: 'categorias',
          type: Types.Autocomplete,
          multiple: true,
          title: 'Categoría',
          placeholder: 'Seleccione una o más categorías',
          // ordenar: true,
          options: docs?.map((e: any) => ({ id: e._id, title: e.nombre })) || [],
          onChangeText: (texto) => {
            call({
              url: 'http://localhost:5050/api/categoria',
              params: {
                ordenado: { nombre: 1 },
                filtros: { nombre: { valor: texto, filtro: 'empiezaCon' } },
              },
            })
          },
          list: {
            filter: true,
          },
        },
      ]}
      description="Crud example"
      name="Camiseta"
      url="http://localhost:5050/api/user"
      renderItem={(props: Categoria) => <ItemCategoria {...props} />}
      onError={(err) => console.log(err)}
      response={{
        list: ({ data }) => ({
          items: data.docs,
          page: 1,
          hasNextPage: false,
          totalDocs: data.length,
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
      itemId="_id"
    />
  )
}
