import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Types, Crud, CrudProps, ABMProvider } from 'material-crud'
import { FaArrowLeft } from 'react-icons/fa'
import { Button, Card, CardActions, CardContent, IconButton } from '@material-ui/core'
import { english } from './lang'
import CustomField from './extra/CustomField'

interface Categoria extends CrudProps {
  nombre: string
  descripcion: string
  requiereNormativa?: boolean
  normativas: { nombre: string }[]
}

const ItemCategoria = ({ nombre, onDelete, onEdit }: Categoria) => {
  return (
    <Card
      style={{
        flex: 1,
        minWidth: 260,
        maxWidth: 260,
        height: 150,
        margin: 8,
      }}>
      <CardContent>
        <p>Nombre: {nombre}</p>
      </CardContent>
      <CardActions>
        <Button onClick={onDelete}>Borrar</Button>
        <Button onClick={onEdit}>Editar</Button>
      </CardActions>
    </Card>
  )
}

export default () => {
  const history = useHistory()

  useEffect(() => {
    return () => {}
  }, [])

  return (
    <ABMProvider>
      <Crud
        Left={
          <IconButton color="inherit" onClick={() => history.push('/')}>
            <FaArrowLeft />
          </IconButton>
        }
        lang={english}
        fields={[
          {
            id: 'custom',
            type: Types.Custom,
            component: (props) => <CustomField {...props} />,
          },
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
            depends: ({ requiereNormativa }: Categoria) => requiereNormativa === true,
            configuration: [
              { type: Types.Input, title: 'Nombre', id: 'prueba' },
              {
                type: Types.Options,
                title: 'Tipo',
                id: 'tipo',
                options: [
                  { id: '1', title: 'Empire' },
                  { id: '2', title: 'OTRO' },
                ],
                placeholder: 'Select one',
              },
              { type: Types.Number, title: 'Cantidad', id: 'cantidad' },
            ],
          },
        ]}
        description="Crud example"
        name="Camiseta"
        url="http://localhost:5050/api/pedidos"
        renderItem={(props: Categoria) => <ItemCategoria {...props} />}
        onError={(err) => console.log(err)}
      />
    </ABMProvider>
  )
}
