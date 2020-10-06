import React, { useMemo, memo, useEffect } from 'react'
import { makeStyles, Chip, Avatar } from '@material-ui/core'
import { useAxios, createFields, Crud, Types, useWindowSize } from 'material-crud'
import { ReactComponent as Camera } from './assets/camera.svg'

export default memo(() => {
  const { height } = useWindowSize()
  const { call, response } = useAxios<any>({})

  useEffect(() => {
    call({
      url: 'http://localhost:5050/api/categoria',
      params: { ordenado: { nombre: 1 } },
    })
  }, [call])

  const { data } = response || {}
  const { docs } = data || {}
  const campos = useMemo(
    () =>
      createFields(() => [
        {
          id: 'imagen',
          type: Types.Image,
          title: 'Imagen',
          placeholder: 'Imagen del producto',
          baseURL: 'http://localhost:5050/archivos/imagenes/productos/',
          ImgButton: <Camera width={60} height={60} />,
          list: {
            width: 20,
            align: 'center',
          },
        },
        {
          id: 'nombre',
          type: Types.Input,
          placeholder: 'Nombre del producto',
          title: 'Nombre',
          list: {
            filter: true,
            sort: true,
            width: 10,
          },
        },
        {
          id: 'descripcion',
          type: Types.Multiline,
          placeholder: 'Descripción del producto, maximo 450 caracteres',
          title: 'Descripción',
          list: {
            filter: true,
            sort: true,
            width: 15,
          },
        },
        {
          id: 'precio',
          type: Types.Number,
          placeholder: 'Precio del producto',
          title: 'Precio',
          list: {
            filter: true,
            sort: true,
            width: 10,
          },
        },
        // {
        //   id: 'categorias',
        //   type: Types.Options,
        //   options: docs?.map((e: any) => ({ id: e._id, title: e.nombre })) || [],
        //   placeholder: 'Seleccione una categoria',
        //   title: 'Categorias',
        //   list: {
        //     list: true,
        //     filter: true,
        //   },
        // },
        {
          id: 'categorias',
          type: Types.Autocomplete,
          // multiple: true,
          title: 'Categoría',
          placeholder: 'Seleccione una o más categorías',
          options: docs?.map((e: any) => ({ id: e._id, title: e.nombre })) || [],
          onChangeText: (texto) => {
            call({
              url: 'http://localhost:5050/api/categoria',
              params: {
                ordenado: { nombre: 1 },
                filtros: { nombre: { valor: texto, filtro: 'empiezaCon' } },
              },
            })
          },
          list: {
            width: 50,
            filter: true,
            component: (props) =>
              props.categorias.map(({ _id, nombre }: any) => (
                <Chip
                  key={_id}
                  avatar={<Avatar>{nombre.substring(0, 1)}</Avatar>}
                  label={nombre}
                  variant="outlined"
                  color="primary"
                  size="small"
                  style={{ marginRight: 8 }}
                />
              )),
          },
        },
      ]),
    [docs, call],
  )

  return (
    <Crud
      url={'http://localhost:5050/api/productor/producto'}
      gender="M"
      name="Producto"
      fields={campos}
      description={
        'Para poder mostrar sus productos en AlimentAPP es necesario cargarlos al sistema. No se preocupe, solo tiene que completar los siguientes campos.'
      }
      isFormData
      table={{
        columns: campos,
        height: height - 190,
        edit: true,
        deleteRow: true,
        rowHeight: 95,
      }}
      itemId="_id"
      itemName="nombre"
      response={{
        list: ({ data }) => ({
          items: data.docs,
          ...data,
        }),
        new: 'item',
        edit: { id: '_id', item: 'item' },
        delete: { id: '_id', item: 'borrado' },
      }}
      interaction={{
        page: 'pagina',
        perPage: 'porPagina',
        filter: 'filtros',
        sort: 'ordenado',
      }}
      transformEdit={(e) => ({
        ...e,
        categorias: e.categorias.map((cat: any) => ({
          _id: cat._id,
          title: cat.nombre,
        })),
      })}
    />
  )
})

const useClases = makeStyles((tema) => ({
  alertContainer: {
    [tema.breakpoints.down('md')]: {
      width: '95%',
    },
    width: '60%',
    margin: '0 auto',
    marginBottom: tema.spacing(1),
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
  },
  mensaje: {
    width: '100%',
  },
}))
