import React, { useEffect, useMemo } from 'react'
import { CenteredCard, createFields, Form, FormTypes, OpcionesProps, useUser } from 'material-crud'
import * as Yup from 'yup'

export default () => {
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
        ],
        {
          id: 'personeriaVigente',
          title: 'Personería vigente',
          type: FormTypes.Switch,
        },
        { id: 'detalle', title: '3. Detalle', type: FormTypes.OnlyTitle },
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
    [],
  )

  return (
    <CenteredCard
      title="Nueva solicitud"
      subtitle={'Complete los siguientes datos para llenar su solicitud'}>
      <Form
        onSubmit={(data) => {
          console.log(data)
        }}
        accept="Enviar"
        fields={fields}
      />
    </CenteredCard>
  )
}
