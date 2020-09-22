import React, { useCallback, useState } from 'react'

import { Dialog, CenteredCard, Form, Types } from 'material-crud'
import CustomField from './extra/CustomField'

export default () => {
  const [dialog, setDialog] = useState<null | Object>(null)
  const [loading, setLoading] = useState(false)

  const submitForm = useCallback(async (vals) => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 2000))
    setDialog(vals)
    setLoading(false)
  }, [])

  return (
    <CenteredCard title="Ejemplo" subtitle={'Subtitulo'}>
      <Form
        loading={loading}
        fields={[
          { id: 'prueba', type: Types.Input, title: 'Prueba' },
          {
            id: 'custom',
            type: Types.Custom,
            component: (props) => <CustomField {...props} />,
          },
        ]}
        accept={'Submit'}
        onSubmit={submitForm}
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
