import React from 'react'
import { render } from '@testing-library/react'
import Crud from '../components/Crud'
import { createFields } from '../components/Form'
import { Types } from '../components/Form/Types'

describe('CrudComponent', () => {
  it('Deberia andar bien', () => {
    const description = 'Crud de prueba'
    const name = 'Prueba'
    const url = 'http://localhost:5050/api/prueba'

    const fields = createFields(() => [
      {
        id: 'input',
        type: Types.Input,
        title: 'Render Input',
      },
      {
        id: 'select',
        type: Types.Options,
        options: [
          { id: 'id1', title: 'Titulo 1' },
          { id: 'id2', title: 'Titulo 2' },
        ],
        placeholder: 'Seleccione una prueba',
        title: 'Pruebas',
      },
    ])

    render(<Crud url={url} description={description} name={name} fields={fields} />)
  })
})
