import React from 'react'
import * as Yup from 'yup'
import { Crud, createFields, Types, useWindowSize, useAxios } from 'material-crud'
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
      filter: true,
      validate: Yup.string().required(),
      list: { width: 20, sort: true },
    },
    {
      id: 'name',
      title: 'Nombre',
      type: Types.Input,
      validate: Yup.string().required(),
      list: { width: 20, sort: true },
    },
    {
      id: 'surname',
      title: 'Apellido',
      type: Types.Input,
      validate: Yup.string().required(),
      list: { width: 20, sort: true },
    },
  ],
  [
    {
      id: 'email',
      title: 'Mail',
      type: Types.Email,
      list: { width: 25, sort: true },
    },
    {
      id: 'phone',
      title: 'Telefono',
      type: Types.Phone,
      list: { width: 25, sort: true },
    },
  ],
  {
    id: 'busquedaGeneral',
    type: Types.Input,
    title: 'General',
    placeholder: 'Buscar por nombre/apellido/mail',
    filter: true,
    edit: false,
  },
  {
    id: 'normativas',
    type: Types.Input,
    title: 'Normativas necesarias',
    depends: ({ active }: any) => active,
  },
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
      description="Los productos tendrán asociada una o más categorías."
      columns={campos}
      height={height - 200}
      edit
      deleteRow
      // hideSelecting,
      rightToolbar={({ rowsSelected, list, deleteCall, editCall, clearSelected }) => (
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
      )}
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
