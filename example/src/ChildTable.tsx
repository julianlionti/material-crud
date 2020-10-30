import React, { memo, useMemo, useState } from 'react'
import * as Yup from 'yup'

import { Tooltip, IconButton, Popover, Typography } from '@material-ui/core'
import { FaWpforms } from 'react-icons/fa'
import { createFields, Crud, Form, Types, useWindowSize } from 'material-crud'

export default () => {
  const { height } = useWindowSize()

  const [testOptions, setTestOptions] = useState([{ id: 'Una' }, { id: 'Dos' }, { id: 'Tres' }])
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const campos = useMemo(
    () =>
      createFields(() => [
        {
          id: 'nombre',
          title: 'Nombre',
          placeholder: 'Nombre de la categoría',
          type: Types.Input,
          validate: Yup.string().required(),
          list: {
            sort: true,
          },
        },
        {
          id: 'nombre2',
          type: Types.Options,
          title: 'Nombre Select',
          options: testOptions,
          onAddItem: (e) => {
            console.log(e)
            setAnchorEl(e)
          },
          placeholder: 'Seleccione una opción',
          list: { width: 40 },
        },
        {
          id: 'descripcion',
          title: 'Descripción',
          placeholder: 'Descripción de la categoría',
          type: Types.Multiline,
          validate: Yup.string().max(450),
          list: {
            sort: true,
          },
        },
        { id: 'fecha', type: Types.Date, title: 'Fecha' /*filter: true*/ },
        {
          id: 'requiereNormativa',
          type: Types.Switch,
          title: 'Requiere normativa',
          list: { sort: true, align: 'center' },
        },
      ]),
    [testOptions],
  )

  return (
    <React.Fragment>
      <Crud
        url={'http://localhost:5050/api/categoria'}
        gender="F"
        name="Categoria"
        columns={campos}
        noTitle
        actions={{
          new: true,
          edit: true,
          delete: true,
        }}
        height={height - 190}
        rowHeight={45}
        description={'Los productos tendrán asociada una o más categorías.'}
        response={{
          list: ({ data }) => ({
            items: data.docs,
            ...data,
          }),
          new: (data, response) => response,
          edit: (data, response) => ({ id: '_id', item: 'item' }),
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
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Form
          fields={[{ id: 'id', title: 'Name', type: Types.Input }]}
          accept="Agregar"
          onSubmit={(props) => {
            setTestOptions((opts) => [...opts, { id: props.id }])
            setAnchorEl(null)
          }}
        />
      </Popover>
    </React.Fragment>
  )
}
