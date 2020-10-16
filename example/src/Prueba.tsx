import React from 'react'
import { createFields, Types, Crud } from 'material-crud'

export default () => {
  const description = 'Crud de prueba'
  const name = 'Prueba'
  const url = 'http://localhost:5050/api/categoria'

  const fields = createFields(() => [
    [
      {
        id: '_id',
        type: Types.Input,
        title: 'ID',
        filter: true,
        readonly: true,
        list: { width: 10 },
      },
      {
        id: 'nombre',
        type: Types.Input,
        title: 'Nombre',
        list: { width: 30 },
      },
    ],
    {
      id: 'select',
      type: Types.Options,
      options: [
        { id: 'id1', title: 'Titulo 1' },
        { id: 'id2', title: 'Titulo 2' },
      ],
      placeholder: 'Seleccione una prueba',
      title: 'Pruebas',
      filter: true,
      list: { width: 60 },
    },
  ])

  return (
    <Crud
      itemId="_id"
      height={500}
      url={url}
      description={description}
      name={name}
      columns={fields}
      response={{
        list: ({ data }) => ({ items: data.docs, ...data }),
      }}
    />
  )
}
