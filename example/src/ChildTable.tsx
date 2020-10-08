import React from 'react'
import { Crud, createFields, Types, useWindowSize } from 'material-crud'
import { IconButton } from '@material-ui/core'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const campos = createFields(() => [
  {
    id: 'normativas',
    type: Types.Input,
    edit: false,
    title: 'Normativas',
    list: {
      align: 'center',
      width: 1,
      height: 250,
      component: ({ expandRow, isExpanded }) => (
        <IconButton onClick={expandRow}>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </IconButton>
      ),
      content: (rowData) => {
        return (
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Hije</span>
          </div>
        )
      },
    },
  },
  {
    id: 'nombre',
    title: 'Nombre',
    placeholder: 'Nombre de la categoría',
    type: Types.Input,
    list: {
      width: 3,
      filter: true,
      sort: true,
      align: 'center',
    },
  },
  {
    id: 'descripcion',
    title: 'Descripción',
    placeholder: 'Descripción de la categoría',
    type: Types.Multiline,
    list: {
      width: 3,
      filter: true,
      sort: true,
    },
  },
  {
    id: 'requiereNormativa',
    type: Types.Switch,
    title: 'Requiere normativa',
    list: {
      width: 3,
      sort: true,
      align: 'center',
    },
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
        rowHeight: 80,
        showSelecting: true,
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
