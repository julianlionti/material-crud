import React, { useCallback, useState } from 'react'
import { Dialog, CenteredCard, Form, Types } from 'material-crud'
import { useHistory } from 'react-router'
import { Button } from '@material-ui/core'
import { FaTimes } from 'react-icons/fa'

export default () => {
  const history = useHistory()
  const [dialog, setDialog] = useState<null | Object>(null)
  const [loading, setLoading] = useState(false)

  const submitForm = useCallback(async (vals) => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 2000))
    setDialog(vals)
    setLoading(false)
  }, [])

  return (
    <CenteredCard
      title="Ejemplo"
      subtitle={'Subtitulo'}
      Right={
        <Button color="inherit" onClick={() => history.push('/')}>
          <FaTimes />
        </Button>
      }>
      <Form
        loading={loading}
        fields={[{ id: 'prueba', type: Types.Input, title: 'Prueba' }]}
        accept={'Submit'}
        onSubmit={submitForm}
      />
      <Dialog
        show={!!dialog}
        onClose={(confirmated) => {
          alert(`Clicked ${confirmated ? 'Accept' : 'Cancel'}`)
          setDialog(null)
        }}
        title={'Material-CRUD'}
        content={JSON.stringify(dialog || {})}
      />
    </CenteredCard>
  )
}
