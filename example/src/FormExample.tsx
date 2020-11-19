import React, { useEffect, useMemo } from 'react'
import { CenteredCard, createFields, Form, FormTypes, OpcionesProps, useUser } from 'material-crud'
import * as Yup from 'yup'
import useAxios from './utils/useAxios'

export default () => {
  const [provincias, loadingProvincias] = useAxios<any>({
    onInit: { url: 'http://localhost:5050/api/servicios/provincias' },
  })

  const [dptos, loadingDptos, getDptos] = useAxios<any>()
  const [localidades, loadingLocali, getLocalidades, cleanLocali] = useAxios<any>()
  const [tipoOrga, loadingTipoOrga] = useAxios<any>({
    onInit: {
      url: 'http://localhost:5050/api/tipo_organizacion',
    },
  })

  const [cadenaProductiva, loadingCadena] = useAxios<any>({
    onInit: {
      url: 'http://localhost:5050/api/cadena_productiva',
    },
  })

  const [asistencias, loadingAsistencia] = useAxios<any>({
    onInit: {
      url: 'http://localhost:5050/api/asistencia',
    },
  })

  const [solicitud, loadingSolicitud, nuevaSolicitud] = useAxios<any>()

  useEffect(() => {
    console.log(solicitud)
  }, [solicitud])

  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'organizacion',
          title: '1. Organización',
          type: FormTypes.OnlyTitle,
        },
        [
          {
            id: 'cuit',
            title: 'CUIT',
            type: FormTypes.Number,
            validate: Yup.string().required().min(11).max(11),
          },
          {
            id: 'nombre',
            title: 'Nombre',
            type: FormTypes.Input,
            validate: Yup.string().required(),
          },
        ],
        [
          {
            id: 'integrantes',
            title: 'Cantidad de Integrantes',
            type: FormTypes.Number,
            grow: 3,
            validate: Yup.number()
              .required('La cantidad de integrantes es obligatoria')
              .moreThan(0, 'El campo debe ser mayor a 0'),
          },
          {
            id: 'tipoOrganizacion',
            title: 'Tipo',
            type: FormTypes.Options,
            placeholder: 'Seleccione el tipo de organización',
            options:
              tipoOrga?.map(
                ({ _id, nombre }: any): OpcionesProps => ({ id: _id, title: nombre }),
              ) || [],
            grow: 7,
            validate: Yup.string().nullable().required(),
          },
        ],
        {
          id: 'personeriaVigente',
          title: 'Personería vigente',
          type: FormTypes.Switch,
        },
        { id: 'locacion', title: '2. Localización', type: FormTypes.OnlyTitle },
        [
          {
            id: 'provincia',
            title: 'Provincia',
            type: FormTypes.Options,
            placeholder: 'Seleccione su provincia',
            options:
              provincias?.map(
                ({ Id, Nombre }: any): OpcionesProps => ({ id: Id, title: Nombre }),
              ) || [],
            validate: Yup.string().nullable().required('La provincia es obligatoria'),
            onSelect: (val) => {
              cleanLocali()
              getDptos({
                url: 'http://localhost:5050/api/servicios/departamentos',
                params: { provincia_id: val },
              })
            },
          },
          {
            id: 'departamento',
            title: 'Departamento',
            type: FormTypes.Options,
            placeholder: 'Seleccione su departamento',
            options:
              dptos?.map(
                ({ Id, NombreMayuscula }: any): OpcionesProps => ({
                  id: Id,
                  title: NombreMayuscula,
                }),
              ) || [],
            validate: Yup.string().nullable().required(),
            onSelect: (val) => {
              getLocalidades({
                url: 'http://localhost:5050/api/servicios/localidades',
                params: { dpto_id: val },
              })
            },
          },
          {
            id: 'localidad',
            title: 'Localidad',
            type: FormTypes.Options,
            placeholder: 'Seleccione su localidad',
            options:
              localidades?.map(
                ({ Id, Nombre }: any): OpcionesProps => ({ id: Id, title: Nombre }),
              ) || [],
          },
        ],
        { id: 'detalle', title: '3. Detalle', type: FormTypes.OnlyTitle },
        {
          id: 'cadenaProductiva',
          title: 'Cadena productiva',
          type: FormTypes.Options,
          placeholder: 'Seleccione la cadena productiva',
          options:
            cadenaProductiva?.map(
              ({ _id, nombre }: any): OpcionesProps => ({ id: _id, title: nombre }),
            ) || [],
          // validate: Yup.string().required(),
        },
        {
          id: 'cadenaProductivaOtro',
          title: 'Otro',
          depends: ({ cadenaproductiva: cadena }) =>
            cadenaProductiva
              ?.find((e: any) => e._id === cadena)
              ?.nombre.toLowerCase()
              .includes('otro') || false,
          type: FormTypes.Input,
          validate: Yup.string()
            .required('La cadena productiva es obligatoria')
            .when(['cadenaProductiva'], (cadenaProductiva: any, schema: any) => {
              console.log(cadenaProductiva)
              return schema.required()
            }),
        },
        {
          id: 'detalleproyecto',
          title: '4. Detalle del proyecto',
          type: FormTypes.OnlyTitle,
        },
        {
          id: 'descripcionProyecto',
          title: 'Descripción del proyecto',
          type: FormTypes.Multiline,
          validate: Yup.string().required('La descripción del proyecto es obligatoria').max(500),
          help: 'Breve descripción del proyecto',
        },
        {
          id: 'asistenciaSolicitada',
          title: 'Asistencia solicitada',
          type: FormTypes.Options,
          options:
            asistencias?.map(
              ({ _id, nombre }: any): OpcionesProps => ({ id: _id, title: nombre }),
            ) || [],
          placeholder: 'Seleccione la asistencia solicitada',
          validate: Yup.array().min(1, 'Debe seleccionar al menos una opción'),
          multiple: true,
        },
        {
          id: 'detalleAsistencia',
          title: 'Detalle de asistencia',
          type: FormTypes.Input,
          validate: Yup.string().required('El detalle de la asistencia es obligatorio').max(200),
        },
        {
          id: 'presupuestoEstimulado',
          title: 'Presupuesto estimulado (OPCIONAL)',
          type: FormTypes.Options,
          placeholder: 'Seleccione su departamento',
          options: [
            { id: 'mini', title: '0 a 2.000.000' },
            { id: 'medio', title: '2.000.000 a 4.000.000' },
            { id: 'maxi', title: 'Mayor a 4.000.000' },
          ],
        },
        {
          id: 'historialSolicitudes',
          title: 'Historial de solicitud de asistencia estatal y/o internacional (Opcional)',
          type: FormTypes.Multiline,
          help: 'Enumere los organismos donde solicitaste asistencia',
        },
      ]),
    [
      provincias,
      dptos,
      localidades,
      getDptos,
      getLocalidades,
      cleanLocali,
      tipoOrga,
      cadenaProductiva,
      asistencias,
    ],
  )

  return (
    <CenteredCard
      title="Nueva solicitud"
      subtitle={'Complete los siguientes datos para llenar su solicitud'}>
      <Form
        onSubmit={(data) => {
          console.log(data)
          nuevaSolicitud({ url: 'http://localhost:5050/api/solicitud', data, method: 'POST' })
        }}
        accept="Enviar"
        fields={fields}
      />
    </CenteredCard>
  )
}
