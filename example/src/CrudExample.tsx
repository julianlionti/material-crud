import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Types, Crud, CrudProps, ABMProvider } from 'material-crud'
import { FaArrowLeft } from 'react-icons/fa'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import { english } from './lang'
import CustomField from './extra/CustomField'

interface Categoria extends CrudProps {
  nombre: string
  descripcion: string
  requiereNormativa?: boolean
  normativas: { nombre: string }[]
}

const ItemCategoria = ({ nombre, onBorrar, onEditar }: Categoria) => {
  const classes = useClasses()
  return (
    <Card className={`${classes.item}`}>
      <CardContent>
        <p>Nombre: {nombre}</p>
      </CardContent>
      <CardActions>
        <Button onClick={onBorrar}>Borrar</Button>
        <Button onClick={onEditar}>Editar</Button>
      </CardActions>
    </Card>
  )
}

const useClasses = makeStyles((theme) => ({
  item: {
    flex: 1,
    minWidth: 260,
    maxWidth: 260,
    height: 150,
    margin: 8,
  },
}))

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
        url="http://localhost:5050/api/categoria"
        renderItem={(props: Categoria) => <ItemCategoria {...props} />}
        onError={(err) => console.log(err)}
        response={{
          list: {
            data: 'data',
            items: 'docs',
            page: 'page',
            hasNextPage: 'hasNextPage',
            nextPage: 'nextPage',
            totalDocs: 'totalDocs',
            totalPages: 'totalPages',
          },
          new: 'item',
          edit: { item: 'item', id: '_id' },
          delete: { item: 'borrado', id: '_id' },
        }}
      />
    </ABMProvider>
  )
}
