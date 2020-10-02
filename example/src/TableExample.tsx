import React from 'react'
import * as Yup from 'yup'

import { Crud, createFields, Types, useWindowSize, CrudProvider } from 'material-crud'

const campos = createFields(() => [
  {
    id: 'nombre',
    title: 'Nombre',
    placeholder: 'Nombre de la categoría',
    type: Types.Input,
    validate: Yup.string().required(),
    list: {
      width: 20,
      filter: true,
      sort: true,
    },
  },
  {
    id: 'descripcion',
    title: 'Descripción',
    placeholder: 'Descripción de la categoría',
    type: Types.Multiline,
    validate: Yup.string().max(450),
    list: {
      width: 30,
      filter: true,
      sort: true,
    },
  },
  {
    id: 'requiereNormativa',
    type: Types.Switch,
    title: 'Requiere normativa',
    list: {
      width: 30,
      sort: true,
      align: 'center',
    },
  },
  {
    id: 'normativas',
    type: Types.Multiple,
    title: 'Normativas necesarias',
    depends: ({ requiereNormativa }: any) => requiereNormativa === true,
    configuration: [
      {
        id: 'normativa',
        type: Types.Input,
        title: 'Normativa necesaria',
        placeholder: 'Nombre de la normativa vigente',
      },
    ],
    list: {
      width: 30,
      // filter: true,
      sort: true,
    },
  },
])

export default () => {
  const { height } = useWindowSize()
  return (
    <CrudProvider>
      <Crud
        url={'http://localhost:5050/api/categoria'}
        gender="F"
        name="Categoria"
        fields={campos}
        description={'Los productos tendrán asociada una o más categorías.'}
        table={{
          columns: campos,
          height: height - 100,
          edit: true,
          deleteRow: true,
          actionsLabel: 'Actions',
        }}
        response={{
          list: ({ data }) => {
            console.log(data)
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
        onError={(err) => console.log(err)}
      />
    </CrudProvider>
  )
}
