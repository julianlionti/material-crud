import React, { memo, useEffect, useMemo, useState } from 'react'
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
} from 'material-crud'
import { FaBeer, FaIceCream, FaUserFriends } from 'react-icons/fa'
import { IconButton } from '@material-ui/core'
import { OpcionesProps } from '../../dist/components/Form/FormTypes'

export default () => {
  const { height } = useWindowSize()
  const [opciones, setOpciones] = useState<OpcionesProps[]>([{ id: 'assda', title: 'asdas' }])

  const [name, setName] = useState('Titulo prueba')
  const { call, response } = useAxios()

  useEffect(() => {
    call({ url: 'http://192.168.102.50:8000/c2/types', method: 'GET' })
    setTimeout(() => {
      setName('Vamo ✌')
    }, 1500)
  }, [call])

  const filters = useMemo(
    () =>
      createFields([
        { id: 'nombre', type: FormTypes.Input, title: 'Nombre *', willSubmit: true },
        { id: 'fecha', type: FormTypes.Date, title: 'Fecha' },
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
          // multiple: true,
        },
        [
          {
            id: 'select2',
            type: FormTypes.Options,
            title: 'Select multiple',
            options: [
              { id: 'Una', title: 'Sarasa' },
              { id: 'Dos' },
              { id: 'Tres' },
              { id: 'Cuatro' },
            ],
            placeholder: 'Select multiple',
            // multiple: true,
          },
          {
            id: 'select3',
            type: FormTypes.Options,
            title: 'Select multiple',
            multiple: true,
            options: [
              { id: 'Una', title: 'Sarasa' },
              { id: 'Dos' },
              { id: 'Tres' },
              { id: 'Cuatro' },
            ],
            placeholder: 'Select multiple',
            // multiple: true,
          },
        ],
      ]),
    [opciones],
  )

  const steps = useMemo(
    () =>
      createSteps([
        {
          id: 'uno',
          title: 'Uno',
          fields: [
            [
              {
                id: 'nombre',
                title: 'Nombre',
                placeholder: 'Nombre de la categoría',
                type: FormTypes.Input,
                validate: Yup.string().required(),
              },
              {
                id: 'select3',
                type: FormTypes.Options,
                title: 'Select multiple',
                multiple: true,
                options: [
                  { id: 'Una', title: 'Sarasa' },
                  { id: 'Dos' },
                  { id: 'Tres' },
                  { id: 'Cuatro' },
                ],
                placeholder: 'Select multiple',
                // multiple: true,
              },
              {
                id: 'type',
                title: 'Type',
                type: FormTypes.Options,
                placeholder: 'Select one type',
                options: [
                  { id: '1', title: 'empire' },
                  { id: '2', title: 'empire' },
                ],
              },
            ],
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
              id: 'descripcion',
              title: 'Descripción',
              placeholder: 'Descripción de la categoría',
              type: FormTypes.Multiline,
              validate: Yup.string().max(450),
            },
            {
              id: 'fecha',
              type: FormTypes.Date,
              title: 'Fecha',
              depends: ({ requiereNormativa }) => requiereNormativa === true,
            },
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

  const fields = useMemo(
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
          id: 'type',
          title: 'Type',
          type: FormTypes.Options,
          placeholder: 'Select one type',
          options: [
            { id: '1', title: 'empire' },
            { id: '2', title: 'empire' },
          ],
        },
        {
          id: 'options',
          title: 'Options',
          type: FormTypes.Multiple,
          configuration: [
            { id: 'empty', type: FormTypes.OnlyTitle, title: 'Select one type first' },
          ],
        },
      ]),
    [],
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
          cellComponent: ({ rowData }) => rowData.nombre || '-',
        },
        {
          id: 'apellido',
          title: 'Apellido',
          width: 2,
          sort: true,
          cellComponent: ({ rowData }) => rowData.apellido || '-',
        },
        {
          id: 'razon_social',
          title: 'Razón Social',
          width: 2,
          sort: true,
          cellComponent: ({ rowData }) => rowData.razon_social || '-',
        },
        // {
        //   id: 'segmentIds',
        //   title: 'Etiquetas',
        //   width: 2,
        //   cellComponent: ({ rowData }) => {
        //     return !rowData.segmentIds?.length ? (
        //       <span>No hay etiquetas</span>
        //     ) : (
        //       rowData.segmentIds?.map((item: any) => <span key={item}>{item}</span>)
        //     )
        //   },
        // },
        {
          id: 'contactsId',
          title: 'Contactos relacionados',
          width: 2,
          type: TableTypes.Custom,
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

  return (
    <React.Fragment>
      <Crud
        url={'http://192.168.102.50:8000/c2'}
        // url={'http://localhost:5050/api/contact'}
        gender="F"
        name={name}
        // steps={steps}
        fields={fields}
        columns={columns}
        filters={filters}
        actions={{ edit: true, delete: false }}
        noFilterOptions
        extraActions={(rowData) => [
          <IconButton key="ice">
            {name === 'Titulo prueba' ? <FaIceCream /> : <FaBeer />}
          </IconButton>,
        ]}
        height={height - 100}
        rowHeight={75}
        description={'Los productos tendrán asociada una o más categorías.'}
        response={{
          list: (cList: any) => ({
            items: cList.results,
            page: cList.current,
            limit: 10,
            totalDocs: cList.count,
          }),
          new: (data: any, response: any) => response,
          edit: (data: any, response: any) => response,
        }}
        interaction={{ page: 'page', perPage: 'limit' }}
        itemName="nombre"
        onError={(err) => console.log(err)}
        transformToEdit={(rowData) => ({ ...rowData, type: [rowData.id] })}
      />
    </React.Fragment>
  )
}
