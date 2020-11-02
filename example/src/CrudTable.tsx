import React, { memo, useMemo, useState } from 'react'
import * as Yup from 'yup'
import {
  createColumns,
  createFields,
  Crud,
  FormTypes,
  useWindowSize,
  TableTypes,
} from 'material-crud'
import { FaIceCream } from 'react-icons/fa'
import { IconButton } from '@material-ui/core'

export default () => {
  const { height } = useWindowSize()

  const columnas = useMemo(
    () => createColumns([{ id: 'nombre', title: 'Nombre', type: TableTypes.String }]),
    [],
  )

  const campos = useMemo(
    () =>
      createFields([
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
      ]),
    [],
  )

  const filters = useMemo(
    () => createFields([{ id: 'nombre', type: FormTypes.Input, title: 'Nombre *' }]),
    [],
  )

  return (
    <React.Fragment>
      <Crud
        url={'http://localhost:5050/api/categoria'}
        gender="F"
        name="Categoria"
        fields={campos}
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
