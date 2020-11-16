import React, { useCallback, useState } from 'react'
import { Dialog, CenteredCard, Form, FormTypes } from 'material-crud'
import { useHistory } from 'react-router'
import CustomField from './extra/CustomField'
import { OpcionesProps } from '../../dist/components/Form/FormTypes'
import { Autocomplete } from '@material-ui/lab'
import { TextField } from '@material-ui/core'

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

  const [opciones, setOpciones] = useState<OpcionesProps[]>([])

  return (
    <CenteredCard
      title="Ejemplo"
      subtitle={'Subtitulo'}
      onClose={() => history.push('/')}
      // Right={
      //   <Button color="inherit" onClick={() => history.push('/')}>
      //     <FaTimes />
      //   </Button>
      // }
    >
      <Form
        loading={loading}
        fields={[
          { id: 'pruebaa', type: FormTypes.Input, title: 'Prueba', new: false },
          {
            id: 'title',
            type: FormTypes.OnlyTitle,
            title: 'Titulo',
          },
          { id: 'switch', type: FormTypes.Switch, title: 'switch' },
          {
            depends: (rowdata) => rowdata.switch,
            id: 'select',
            type: FormTypes.Options,
            title: 'Select multiple',
            options: [
              { id: 'Una', title: 'Sarasa' },
              { id: 'Dos' },
              { id: 'Tres' },
              { id: 'Cuatro' },
            ],
            placeholder: 'Select multiple',
            multiple: true,
          },
          {
            type: FormTypes.Autocomplete,
            title: 'Prueba con opciones',
            id: 'prueba',
            multiple: true,
            onChangeText: (text) => {
              if (text.length > 2) {
                setOpciones([
                  { id: 'prueba1', title: 'prueba 1' },
                  { id: 'prueba2', title: 'prueba 2' },
                ])
              }
            },
            options: opciones,
          },
          {
            id: 'custom',
            type: FormTypes.Custom,
            component: (props) => <CustomField {...props} />,
            title: '',
          },
        ]}
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
