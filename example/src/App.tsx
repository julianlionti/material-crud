import React from 'react'

import { CenteredCard, Form, Tipos } from 'material-crud'

const App = () => {
  return (
    <CenteredCard title="Ejemplo">
      <Form fields={[{ id: 'Prueba', type: Tipos.Input, title: 'Prueba' }]} />
    </CenteredCard>
  )
}

export default App
