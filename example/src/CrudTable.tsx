import React, { memo, useMemo, useState } from 'react'
import * as Yup from 'yup'
import {
  createColumns,
  createFields,
  Crud,
  FormTypes,
  useWindowSize,
  TableTypes,
  createSteps,
} from 'material-crud'
import { FaIceCream } from 'react-icons/fa'
import { IconButton } from '@material-ui/core'

export default () => {
  const { height } = useWindowSize()

  const columnas = useMemo(
    () => createColumns([{ id: 'nombre', title: 'Nombre', type: TableTypes.String }]),
    [],
  )

  const filters = useMemo(
    () => createFields([{ id: 'nombre', type: FormTypes.Input, title: 'Nombre *' }]),
    [],
  )

  const steps = useMemo(
    () =>
      createSteps([
        {
          id: 'uno',
          title: 'Uno',
          fields: [
            {
              id: 'nombre',
              title: 'Nombre',
              placeholder: 'Nombre de la categoría',
              type: FormTypes.Input,
              validate: Yup.string().required(),
            },
            {
              id: 'descripcion',
              title: 'Descripción',
              placeholder: 'Descripción de la categoría',
              type: FormTypes.Multiline,
              validate: Yup.string().max(450),
            },
            { id: 'fecha', type: FormTypes.Date, title: 'Fecha' },
            {
              id: 'requiereNormativa',
              type: FormTypes.Switch,
              title: 'Requiere normativa',
            },
          ],
        },
        {
          id: 'dos',
          title: 'Dos',
          fields: [
            {
              id: 'nombre2',
              title: 'Nombre 2',
              placeholder: 'Nombre de la categoría',
              type: FormTypes.Input,
              validate: Yup.string().required(),
            },
            {
              id: 'descripcion2',
              title: 'Descripción 2',
              placeholder: 'Descripción de la categoría',
              type: FormTypes.Multiline,
              validate: Yup.string().max(450),
            },
            { id: 'fecha2', type: FormTypes.Date, title: 'Fecha 2' },
            {
              id: 'requiereNormativa2',
              type: FormTypes.Switch,
              title: 'Requiere normativa 2',
            },
          ],
        },
      ]),
    [],
  )

  return (
    <React.Fragment>
      <Crud
        url={'http://localhost:5050/api/categoria'}
        gender="F"
        name="Categoria"
        steps={steps}
        columns={columnas}
        filters={filters}
        actions={{ edit: true, delete: false }}
        extraActions={[
          <IconButton>
            <FaIceCream />
          </IconButton>,
        ]}
        height={height - 100}
        rowHeight={45}
        description={'Los productos tendrán asociada una o más categorías.'}
        response={{
          list: ({ data }) => ({
            items: data.docs,
            ...data,
          }),
          new: (data, response) => response,
          edit: (data, response) => ({ id: '_id', ...response }),
        }}
        interaction={{
          page: 'pagina',
          perPage: 'porPagina',
          filter: 'filtros',
          sort: 'ordenado',
        }}
        itemName="nombre"
        onError={(err) => console.log(err)}
      />
    </React.Fragment>
  )
}
