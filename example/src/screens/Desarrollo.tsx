import { Chip } from '@material-ui/core'
import { createColumns, Crud, TableTypes, useWindowSize } from 'material-crud'
import React, { useMemo } from 'react'

export interface Asistencia {
  _id: string
  nombre: string
}

export default () => {
  const { height } = useWindowSize()

  const columns = useMemo(
    () =>
      createColumns([
        {
          id: 'nombrecuit',
          title: 'Nombre/Cuit',
          width: 2,
          sort: true,
          type: TableTypes.String,
          truncate: 25,
          // noWrap: false,
        },
        { id: 'tipoOrganizacion', title: 'Tipo Orga', width: 2, sort: true },
        { id: 'provincia', title: 'Provincia', width: 2, sort: true },
        { id: 'cadenaProductiva', title: 'C. Productiva', width: 2 },
        {
          id: 'asistenciaSolicitada',
          title: 'Asistencia',
          width: 4,
          type: TableTypes.Custom,
          content: () => null,
          cellComponent: ({ rowData: { asistenciaSolicitada } }) =>
            asistenciaSolicitada.map(({ _id, nombre }: any) => (
              <li key={_id}>
                <Chip label={nombre} />
              </li>
            )),
        },
      ]),
    [],
  )

  return (
    <Crud
      itemName="usuario"
      gender="M"
      // fields={fields}
      columns={columns}
      name="Usuarios"
      url={'http://localhost:5050/api/solicitud'}
      // rowHeight={50}
      actions={{ edit: false, delete: false }}
      response={{
        list: ({ data }: any) => ({ items: data?.docs, ...data }),
        new: (data: any, response: any) => response.item,
        edit: (data: any, response: any) => response.item,
      }}
      height={height - 100}
      interaction={{ page: 'pagina', perPage: 'porPagina', filter: 'filtros', sort: 'orden' }}
      onError={(error) => console.log(error)}
      detailView={(rowdata) => ({
        sections: [
          {
            title: 'Contacto solicitante',
            section: [
              [
                ['Nombre', rowdata.nombre],
                ['DNI', rowdata.dni],
              ],
              [
                ['Nombre', rowdata.nombre],
                ['DNI', rowdata.dni],
              ],
            ],
          },
        ],
      })}
    />
  )
}
