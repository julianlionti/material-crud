import React from 'react'
import * as Yup from 'yup'
import { Crud, createFields, Types, useWindowSize, useAxios } from 'material-crud'
import { english } from './lang'
import { IconButton, makeStyles, Tooltip } from '@material-ui/core'
import { FaTrash } from 'react-icons/fa'
// import { useSnackbar } from 'notistack'

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
  // const { enqueueSnackbar } = useSnackbar()

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
      itemId="_id"
      itemName="name"
      response={{
        list: ({ data }) => ({
          items: data.docs,
          ...data,
        }),
        new: (data, { item }) => item,
        edit: (data, { item }) => item,
      }}
      // onError={(e) => enqueueSnackbar(e)}
      interaction={{
        page: 'pagina',
        perPage: 'porPagina',
        filter: 'filtros',
        sort: 'ordenado',
      }}
    />
  )
}

const useClases = makeStyles((tema) => ({
  alertContainer: {
    [tema.breakpoints.down('md')]: {
      width: '95%',
    },
    width: '60%',
    margin: '0 auto',
    marginBottom: tema.spacing(1),
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
  },
  mensaje: {
    width: '100%',
  },
}))
