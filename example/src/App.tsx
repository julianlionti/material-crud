import React, { useState } from 'react'

import { Dialog, CenteredCard, Form, Tipos } from 'material-crud'

const App = () => {
  const [dialog, setDialog] = useState<null | Object>(null)

  return (
    <CenteredCard title="Ejemplo" subtitle={'Subtitulo'}>
      <Form
        fields={[{ id: 'prueba', type: Tipos.Input, title: 'Prueba' }]}
        accept={'Submit'}
        onSubmit={(vals) => setDialog(vals)}
      />
      <Dialog
        show={!!dialog}
        onClose={() => setDialog(null)}
        title={'Material-CRUD'}
        content={JSON.stringify(dialog || {})}
      />
    </CenteredCard>
  )
}

export default App
