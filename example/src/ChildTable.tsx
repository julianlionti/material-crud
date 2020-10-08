import React from 'react'
import { Crud, createFields, Types, useWindowSize } from 'material-crud'
import { IconButton } from '@material-ui/core'
import { FaAsterisk } from 'react-icons/fa'

const campos = createFields(() => [
  {
    id: 'normativas',
    type: Types.Input,
    edit: false,
    title: 'Normativas',
    list: {
      width: 10,
      component: (props, expandRow) => (
        <IconButton
          onClick={() => {
            expandRow()
            console.log(props)
          }}>
          <FaAsterisk />
        </IconButton>
      ),
      content: () => {
        return <span>Hije</span>
      },
    },
  },
  {
    id: 'nombre',
    title: 'Nombre',
    placeholder: 'Nombre de la categoría',
    type: Types.Input,
    list: {
      filter: true,
      sort: true,
    },
  },
  {
    id: 'descripcion',
    title: 'Descripción',
    placeholder: 'Descripción de la categoría',
    type: Types.Multiline,
    list: {
      filter: true,
      sort: true,
    },
  },
  {
    id: 'requiereNormativa',
    type: Types.Switch,
    title: 'Requiere normativa',
    list: { sort: true },
  },
])

export default () => {
  const { height } = useWindowSize()

  return (
    <Crud
      url={'http://localhost:5050/api/categoria'}
      gender="F"
      name="Categoria"
      fields={campos}
      description={'Los productos tendrán asociada una o más categorías.'}
      table={{
        columns: campos,
        height: height - 190,
        edit: true,
        deleteRow: true,
        rowHeight: 65,
        hideSelecting: false,
      }}
      response={{
        list: ({ data }) => ({
          items: data.docs,
          ...data,
        }),
        new: 'item',
        edit: { id: '_id', item: 'item' },
        delete: { id: '_id', item: 'borrado' },
      }}
      interaction={{
        page: 'pagina',
        perPage: 'porPagina',
        filter: 'filtros',
        sort: 'ordenado',
      }}
      itemId="_id"
      itemName="nombre"
      onError={(err) => console.log(err)}
    />
  )
}
