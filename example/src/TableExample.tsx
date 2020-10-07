import React from 'react'
import * as Yup from 'yup'
import { Crud, createFields, Types, useWindowSize, useAxios } from 'material-crud'
import { english } from './lang'
import { IconButton, Tooltip } from '@material-ui/core'
import { FaTrash } from 'react-icons/fa'

const campos = createFields(() => [
  [
    {
      id: 'active',
      title: 'Activo',
      type: Types.Switch,
      list: { width: 10 },
    },
    {
      id: 'admin',
      title: 'Admin',
      type: Types.Switch,
      list: { width: 10 },
    },
  ],
  [
    {
      id: 'username',
      title: 'Usuario',
      type: Types.Input,
      validate: Yup.string().required(),
      list: { width: 20, filter: true, sort: true },
    },
    {
      id: 'name',
      title: 'Nombre',
      type: Types.Input,
      validate: Yup.string().required(),
      list: { width: 20, filter: true, sort: true },
    },
    {
      id: 'surname',
      title: 'Apellido',
      type: Types.Input,
      validate: Yup.string().required(),
      list: { width: 20, filter: true, sort: true },
    },
  ],
  [
    {
      id: 'email',
      title: 'Mail',
      type: Types.Email,
      list: { width: 25, filter: true, sort: true },
    },
    {
      id: 'phone',
      title: 'Telefono',
      type: Types.Phone,
      list: { width: 25, filter: true, sort: true },
    },
  ],
  // {
  //   id: 'normativas',
  //   type: Types.Multiple,
  //   title: 'Normativas necesarias',
  //   depends: ({ requiereNormativa }: any) => requiereNormativa === true,
  //   configuration: [
  //     {
  //       id: 'normativa',
  //       type: Types.Input,
  //       title: 'Normativa necesaria',
  //       placeholder: 'Nombre de la normativa vigente',
  //     },
  //   ],
  //   list: {
  //     width: 30,
  //     // filter: true,
  //     sort: true,
  //   },
  // },
])

export default () => {
  const { height } = useWindowSize()
  const { call } = useAxios()

  return (
    <Crud
      url="http://localhost:5050/api/user"
      // gender="F"
      name="Category"
      fields={campos}
      description="Los productos tendrán asociada una o más categorías."
      table={{
        columns: campos,
        height: height - 200,
        edit: true,
        deleteRow: true,
        // hideSelecting: true,
        rightToolbar: ({ rowsSelected, list, deleteCall, editCall, clearSelected }) => (
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => {
                rowsSelected.forEach(({ _id }) => {
                  call({
                    method: 'DELETE',
                    data: { id: _id },
                    url: 'http://localhost:5050/api/user',
                  })
                  deleteCall(_id)
                  clearSelected()
                })
              }}>
              <FaTrash />
            </IconButton>
          </Tooltip>
        ),
      }}
      response={{
        list: ({ data }) => {
          console.log(data?.docs)
          return {
            items: data.docs,
            ...data,
          }
        },
        new: 'item',
        edit: { id: '_id', item: 'item' },
        delete: { id: '_id', item: 'borrado' },
      }}
      interaction={{
        page: 'pagina',
        perPage: 'porPagina',
        sort: 'ordenado',
      }}
      itemName="username"
      onError={(err) => console.log(err)}
      itemId="_id"
    />
  )
}
