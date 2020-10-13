import React from 'react'
import { Crud, createFields, Types, useWindowSize } from 'material-crud'
import { IconButton } from '@material-ui/core'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const campos = createFields(() => [
  {
    id: 'normativas',
    type: Types.Expandable,
    title: 'Normativas',
    filter: true,
    list: {
      align: 'flex-start',
      width: 1,
      height: 250,
      cellComponent: ({ expandRow, isExpanded }) => (
        <IconButton onClick={expandRow}>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </IconButton>
      ),
      content: (rowData) => {
        return (
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
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
    filter: true,
    list: { width: 3, sort: true, align: 'center' },
  },
  {
    id: 'descripcion',
    title: 'Descripción',
    placeholder: 'Descripción de la categoría',
    type: Types.Multiline,
    filter: true,
    list: { width: 3, sort: true },
  },
  {
    id: 'requiereNormativa',
    type: Types.Switch,
    title: 'Requiere normativa',
    filter: true,
    list: { width: 3, sort: true, align: 'center' },
  },
  {
    id: 'pass',
    type: Types.Secure,
    title: 'Requiere normativa',
  },
  {
    id: 'normativa',
    type: Types.File,
    title: 'Normativa',
    baseURL: 'imagenProducto',
    accept: 'application/msword, application/pdf',
    renderPreview: (data) => {
      return (
        <div style={{ padding: 8 }}>
          <iframe src={data!!} title="Normativa" />
        </div>
      )
    },

    list: { width: 60 },
  },
])

export default () => {
  const { height } = useWindowSize()

  return (
    <Crud
      url={'http://localhost:5050/api/categoria'}
      name="Categoria"
      description={'Los productos tendrán asociada una o más categorías.'}
      columns={campos}
      height={height - 100}
      edit={true}
      deleteRow={true}
      rowHeight={80}
      showSelecting={true}
      // rightToolbar: () => {
      //   return (
      //     <IconButton size="small">
      //       <FaTrash />
      //     </IconButton>
      //   )
      // },
      response={{
        list: ({ data }) => ({
          items: data.docs,
          ...data,
        }),
        new: (data, response) => response,
        edit: (data, response) => ({ id: '_id', item: 'item' }),
      }}
      interaction={{
        page: 'pagina',
        perPage: 'porPagina',
        filter: 'filtros',
        sort: 'ordenado',
      }}
      itemId="_id"
      idInUrl
      itemName="nombre"
      onError={(err) => console.log(err)}
    />
  )
}
