import {
  createColumns,
  createFields,
  Crud,
  FormTypes,
  TableTypes,
  useAxios,
  useWindowSize,
} from 'material-crud'
import React, { useMemo } from 'react'

export interface Asistencia {
  _id: string
  nombre: string
}

export default () => {
  const { height } = useWindowSize()
  const { response, call } = useAxios()

  const columns = useMemo(
    () =>
      createColumns([
        { id: 'usuario', title: 'Usuario', width: 7, sort: true },
        { id: 'activo', title: 'Activo', type: TableTypes.Switch, width: 1 },
      ]),
    [],
  )

  const fields = useMemo(
    () =>
      createFields([
        { id: 'usuario', title: 'Usuario', type: FormTypes.Input },
        { id: 'activo', title: 'Activo', type: FormTypes.Switch, new: false },
        {
          id: 'busqueda',
          title: 'Buscar por apellido',
          type: FormTypes.Autocomplete,
          options: response?.map((e: any) => ({ id: e.Login, title: `${e.NombreCompleto}` })) || [],
          onChangeText: (apellido) => {
            call({ url: 'http://localhost:5050/api/servicios/usuariosAD', params: { apellido } })
          },
          onSelect: ({ setValues }) => {
            setValues({ usuario: 'sarasa' })
          },
        },
      ]),
    [response],
  )

  return (
    <Crud
      itemName="usuario"
      gender="M"
      fields={fields}
      columns={columns}
      name="Usuarios"
      url={'http://localhost:5050/api/usuario'}
      actions={{ edit: true, delete: true }}
      response={{
        list: ({ data }: any) => ({ items: data?.docs, ...data }),
        new: (data: any, response: any) => response.item,
        edit: (data: any, response: any) => response.item,
      }}
      height={height - 190}
      interaction={{ page: 'pagina', perPage: 'porPagina', filter: 'filtros', sort: 'orden' }}
      onError={(error) => console.log(error)}
    />
  )
}
