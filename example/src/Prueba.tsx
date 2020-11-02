import React from 'react'
import { createFields, FormTypes, Crud } from 'material-crud'

export default () => {
  const description = 'Crud de prueba'
  const name = 'Prueba'
  const url = 'http://localhost:5050/api/categoria'

  // const fields = createFields()

  return (
    <Crud
      itemId="_id"
      height={500}
      url={url}
      description={description}
      name={name}
      columns={[]}
      response={{
        list: ({ data }) => ({ items: data.docs, ...data }),
      }}
    />
  )
}
