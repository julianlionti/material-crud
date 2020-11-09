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
  useAxios,
  createMoreOptions,
} from 'material-crud'
import { FaIceCream, FaUserFriends } from 'react-icons/fa'
import { IconButton } from '@material-ui/core'
import { OpcionesProps } from '../../dist/components/Form/FormTypes'

export default () => {
  const { height } = useWindowSize()
  const { call, response } = useAxios()

  // const columnas = useMemo(
  //   () => createColumns([{ id: 'nombre', title: 'Nombre', type: TableTypes.String }]),
  //   [],
  // )
  const filters = useMemo(
    () =>
      createFields([
        { id: 'nombre', type: FormTypes.Input, title: 'Nombre *', willSubmit: true },
        {
          id: 'segment',
          type: FormTypes.Autocomplete,
          title: 'Etiquetas',
          options:
            response?.data.docs.map(({ _id, name }: any) => ({
              id: _id,
              title: name,
            })) || [],
          onChangeText: (segment) => {
            call({
              url: 'http://localhost:5050/api/etiqueta',
              params: { filtros: { value: segment, filter: 'startsWith' } },
            })
          },
          multiple: true,
          onAddItem: (e) => {
            console.log(e)
          },
        },
      ]),
    [response],
  )

  const [opciones, setOpciones] = useState<OpcionesProps[]>([
    /*-{ id: 'assda', title: 'asdas' }*/
  ])

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
              type: FormTypes.Autocomplete,
              title: 'Prueba con opciones',
              id: 'prueba',
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
    [opciones],
  )

  const columns = useMemo(
    () =>
      createColumns([
        {
          id: 'isCompany',
          type: TableTypes.Switch,
          title: 'Empresa',
          width: 1,
          align: 'center',
        },
        {
          id: 'active',
          type: TableTypes.Switch,
          title: 'Activo',
          width: 1,
          align: 'center',
        },
        {
          id: 'nombre',
          title: 'Nombre',
          width: 2,
          sort: true,
        },
        {
          id: 'apellido',
          title: 'Apellido',
          width: 2,
          sort: true,
        },
        {
          id: 'razon_social',
          title: 'Razón Social',
          width: 2,
          sort: true,
        },
        {
          id: 'segmentIds',
          title: 'Etiquetas',
          width: 2,
          cellComponent: ({ rowData }) => {
            return !rowData.segmentIds?.length ? (
              <span>No hay etiquetas</span>
            ) : (
              rowData.segmentIds?.map((item: any) => <span key={item.name}>{item.name}</span>)
            )
          },
        },
        {
          id: 'contactsId',
          title: 'Contactos relacionados',
          width: 2,
          cellComponent: ({ rowData, expandRow }) => (
            <IconButton onClick={expandRow} disabled={!rowData.isCompany}>
              <FaUserFriends />
            </IconButton>
          ),
          content: ({ contactsId }) =>
            !contactsId?.length ? (
              <span>No hay contactos</span>
            ) : (
              contactsId.map((item: any) => <span key={item}>{item}</span>)
            ),
        },
      ]),
    [],
  )

  const moreOptions = createMoreOptions([
    {
      id: 'exportar',
      title: 'Exportar',
      onClick: () => {
        console.log('Exportar')
      },
    },
  ])

  return (
    <React.Fragment>
      <Crud
        url={'http://localhost:5050/api/contact'}
        gender="F"
        name="Categoria"
        steps={steps}
        columns={columns}
        filters={filters}
        actions={{ edit: true, delete: false }}
        height={height - 100}
        rowHeight={75}
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
        moreOptions={moreOptions}
      />
    </React.Fragment>
  )
}
