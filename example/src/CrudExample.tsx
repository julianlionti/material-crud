import React, { useCallback, useState } from 'react'

import { Dialog, CenteredCard, Form, Types, Crud } from 'material-crud'

interface Camiseta {
  jugador: string
  numero: number
  equipo: string
}

const ItemCamiseta = ({ jugador, numero, equipo }: Camiseta) => {
  return (
    <div style={{ flex: 1 }}>
      <div>
        <span>Equipo: {equipo}</span>
      </div>
    </div>
  )
}

export default () => {
  return (
    <Crud
      fields={[
        { id: 'equipo', type: Types.Input, title: 'Equipo' },
        [
          { id: 'jugador', type: Types.Input, title: 'Jugador', grow: 6 },
          { id: 'numero', type: Types.Number, title: 'Numero', grow: 4 },
        ],
      ]}
      gender="F"
      description="Crud example"
      name="Camiseta"
      url="http://localhost:5050/api/camiseta"
      renderItem={(props: Camiseta) => {
        return <ItemCamiseta {...props} />
      }}
      onError={(err) => console.log(err)}
    />
  )
}
