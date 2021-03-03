import React, { useMemo } from 'react'
import { callWs, CenteredCard, createFields, Form, FormTypes } from 'material-crud'
import { ReactComponent as PDF } from '../assets/pdf.svg'

export default () => {
  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'organizacion',
          title: '1. Organización',
          type: FormTypes.OnlyTitle,
        },
        {
          id: 'dragable',
          type: FormTypes.Draggable,
          multiple: true,
          accept: 'application/pdf',
          title: 'Pryeba',
          ImgIcon: <PDF />,
          renderPreview: (name) => {
            return (
              <a href={'http://localhost:5050/archivos/normativas/' + name}>
                <iframe
                  title="name"
                  style={{ overflow: 'hidden' }}
                  height={100}
                  width={125}
                  src={'http://localhost:5050/archivos/normativas/' + name}
                />
              </a>
            )
          },
          onDeleteFile: (name) => {
            console.log(name)
            return true
          },
        },
        [
          {
            id: 'cuit',
            title: 'CUIT',
            type: FormTypes.Number,
          },
          {
            id: 'nombre',
            title: 'Nombre',
            type: FormTypes.Input,
          },
        ],
        [
          {
            id: 'integrantes',
            title: 'Cantidad de Integrantes',
            type: FormTypes.Number,
            grow: 3,
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
          help: 'Breve descripción del proyecto',
        },
        {
          id: 'detalleAsistencia',
          title: 'Detalle de asistencia',
          type: FormTypes.Input,
        },
        {
          id: 'presupuestoEstimulado',
          title: 'Presupuesto estimulado (OPCIONAL)',
          type: FormTypes.Options,
          placeholder: 'Seleccione su departamento',
          multiple: true,
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
        isFormData
        isEditing
        intials={{
          cuit: 494984,
          nombre: 'prueba',
          dragable: ['1602689224490.pdf', '1602692551989.pdf'],
          presupuestoEstimulado: [],
        }}
        onSubmit={(data) => {
          callWs({
            url: 'http://localhost:5050/api/normativa/productor',
            headers: {
              Authorization:
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjQ0MGE1YjZhOTZhMTIyMjA3YTQ5MGIiLCJpYXQiOjE2MTE0MTY1OTgsImV4cCI6MTYxMjcxMjU5OH0.M-IEXpK9UgBOKBR6bAx864orQBi1WtQLk_Yoq2hmbR0',
            },
            data,
            method: 'POST',
          })
          console.log(data)
        }}
        accept="Enviar"
        fields={fields}
      />
    </CenteredCard>
  )
}
