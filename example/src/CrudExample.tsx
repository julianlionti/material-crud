import React from 'react'

import { Types, Crud, ABMProvider } from 'material-crud'
import { Card } from '@material-ui/core'
import { english } from "./lang";

interface Categoria {
  nombre: string
  descripcion: string
  requiereNormativa?: boolean
  normativas: { nombre: string }[]
}

const ItemCategoria = ({ nombre }: Categoria) => {
  return (
    <Card style={{ flex: 1, minWidth: 260, maxWidth: 260, height: 150, margin: 8 }}>
      <div>
        <span>Nombre: {nombre}</span>
      </div>
    </Card>
  )
}

export default () => {
  return (
    <ABMProvider>
      <Crud
        lang={english}
        fields={[
          {
            id: 'nombre',
            title: 'Nombre',
            placeholder: 'Nombre de la categoría',
            type: Types.Input,
            filter: true,
            sort: true,
          },
          {
            id: 'descripcion',
            title: 'Descripción',
            placeholder: 'Descripción de la categoría',
            type: Types.Multiline,
            filter: true,
            sort: true,
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
            depends: ({ requiereNormativa }: Categoria) => requiereNormativa === false,
            configuration: {
              nombre: { type: Types.Input, title: 'Nombre' },
              cantidad: { type: Types.Number, title: 'Cantidad' },
            },
          },
        ]}
        // gender="F"
        description="Crud example"
        name="Camiseta"
        url="http://localhost:5050/api/categoria"
        renderItem={(props: Categoria) => {
          return <ItemCategoria {...props} />
        }}
        onError={(err) => console.log(err)}
      />
    </ABMProvider>
  )
}
