import React, { memo, useMemo } from 'react'
import * as Yup from 'yup'

import { Tooltip, IconButton } from '@material-ui/core'
import { FaWpforms } from 'react-icons/fa'
import { createFields, Crud, Types, useWindowSize } from 'material-crud'

const NormativasTable = memo(({ rowData }: any) => {
  return (
    <Crud
      title={'Vamo Racing'}
      onError={(err) => console.log(err)}
      description={`Agregar normativa correspondiente a la Categoría ${rowData.nombre}`}
      name="Normativa"
      gender="F"
      url={'http://localhost:5050/api/normativa'}
      columns={[
        {
          id: 'nombre',
          type: Types.Input,
          title: 'Nombre',
          list: { width: 40 },
        },
        {
          id: 'normativa',
          type: Types.File,
          title: 'Normativa',
          baseURL: 'imagenProducto',
          accept: 'application/pdf',
          help: 'Subir la normativa en formato PDF',
          list: { width: 60 },
          renderPreview: (base64) => {
            return <iframe title={'Normativa'} width="100%" src={base64!!} />
          },
        },
      ]}
      height={270}
      itemId="_id"
      itemName="nombre"
      rowHeight={80}
      response={{
        list: ({ data }) => ({
          items: data.docs,
          ...data,
        }),
        new: (data, { item }) => item,
        edit: (data, { item }) => ({ item }),
      }}
      interaction={{
        page: 'pagina',
        perPage: 'porPagina',
        filter: 'filtros',
        sort: 'ordenado',
      }}
      isFormData
      transform={(_, data) => ({ ...data, categoriaId: rowData._id })}
    />
  )
})

export default () => {
  const { height } = useWindowSize()

  const campos = useMemo(
    () =>
      createFields(() => [
        {
          id: 'normativas',
          type: Types.Expandable,
          title: 'Normativas',
          list: {
            height: 600,
            cellComponent: ({ rowData, expandRow }) => {
              const { requiereNormativa } = rowData
              return (
                <Tooltip
                  title={requiereNormativa ? 'Agregar normativas' : 'Se debe editar la categoría'}>
                  <span>
                    <IconButton onClick={expandRow} disabled={!requiereNormativa}>
                      <FaWpforms />
                    </IconButton>
                  </span>
                </Tooltip>
              )
            },
            content: (rowData: any) => <NormativasTable rowData={rowData} />,
          },
        },
        {
          id: 'nombre',
          title: 'Nombre',
          placeholder: 'Nombre de la categoría',
          type: Types.Input,
          validate: Yup.string().required(),
          filter: true,
          list: {
            sort: true,
          },
        },
        {
          id: 'descripcion',
          title: 'Descripción',
          placeholder: 'Descripción de la categoría',
          type: Types.Multiline,
          validate: Yup.string().max(450),
          filter: true,
          list: {
            sort: true,
          },
        },
        { id: 'fecha', type: Types.Date, title: 'Fecha', filter: true },
        {
          id: 'requiereNormativa',
          type: Types.Switch,
          title: 'Requiere normativa',
          list: { sort: true, align: 'center' },
        },
        // {
        //   id: 'normativas',
        //   type: Types.Multiple,
        //   title: 'Normativas necesarias',
        //   depends: ({ requiereNormativa }: Categoria) => requiereNormativa === true,
        //   configuration: [
        //     {
        //       id: 'normativa',
        //       type: Types.Input,
        //       title: 'Normativa necesaria',
        //       placeholder: 'Nombre de la normativa vigente',
        //     },
        //   ],
        //   list: {
        //     align: 'center',
        //     cellComponent: ({ normativas }: any) => (
        //       <span style={{ whiteSpace: 'normal' }}>
        //         {normativas?.map((e: any) => e.normativa).join(' - ') || ' - '}
        //       </span>
        //     ),
        //   },
        // },
      ]),
    [],
  )

  return (
    <Crud
      url={'http://localhost:5050/api/categoria'}
      gender="F"
      name="Categoria"
      columns={campos}
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
      edit
      deleteRow
    />
  )
}
