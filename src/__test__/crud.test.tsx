import React from 'react'
import { IconButton } from '@material-ui/core'
import { act, cleanup, render } from '@testing-library/react'
import Axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { FaPlus } from 'react-icons/fa'
import { createResponseConf } from '../components/Crud'
import Crud from '../components/Crud/WithProvider'
import { createFields } from '../components/Form'
import { FormTypes } from '../components/Form/FormTypes'
import { createColumns, createExtraActions } from '../components/Table'
import { ActionProps } from '../components/Table/TableTypes'
import { enUS } from '../translate/en_us'
import { CrudProvider } from '../utils/CrudContext'

import { fakeGet } from './generators'
import testList from './helpers/testList'

jest.mock('react-virtualized-auto-sizer', () => ({ children }: any) =>
  children({ height: 600, width: 600 }),
)
jest.setTimeout(30000)

const mock = new MockAdapter(Axios)
mock.onGet().reply((data) => {
  const { page, perPage } = data.params
  const listado = fakeGet({ page, perPage })
  return [200, listado]
})
mock.onDelete().reply(200)

describe('CrudComponent FakeData AlimentAPP', () => {
  beforeEach(cleanup)

  it('Deberia andar bien', async () => {
    const currentLang = enUS
    const description = 'Crud de prueba'
    const name = 'Prueba'
    const url = 'http://localhost:5050/api/prueba'

    const fields = createFields([
      [
        {
          id: '_id',
          type: FormTypes.Input,
          title: 'ID',
          filter: true,
          readonly: true,
        },
        {
          id: 'nombre',
          type: FormTypes.Input,
          title: 'Nombre',
        },
      ],
      {
        id: 'select',
        type: FormTypes.Options,
        options: [
          { id: 'id1', title: 'Titulo 1' },
          { id: 'id2', title: 'Titulo 2' },
        ],
        placeholder: 'Seleccione una prueba',
        title: 'Pruebas',
        filter: true,
      },
    ])

    const columns = createColumns([
      { id: 'id', title: 'ID' },
      { id: 'nombre', title: 'Nombre' },
    ])

    const filters = createFields([{ id: 'nombre', type: FormTypes.Input, title: 'Nombre' }])
    const actions: ActionProps = { edit: true, delete: true }

    const extraActions = createExtraActions((rowdata) => [
      <IconButton key={rowdata._id}>
        <FaPlus />
      </IconButton>,
    ])

    const responseConf = createResponseConf({
      list: ({ data }) => ({ items: data.docs, ...data }),
    })

    const crudElement = render(
      <CrudProvider lang={currentLang}>
        <Crud
          url={url}
          itemId="_id"
          description={description}
          name={name}
          actions={actions}
          fields={fields}
          filters={filters}
          extraActions={extraActions}
          columns={columns}
          response={responseConf}
        />
      </CrudProvider>,
    )
    await act(async () => {})

    await testList({
      lang: currentLang,
      description,
      name,
      url,
      crudElement,
      actions,
      columns,
      extraActions,
      filters,
      response: responseConf,
    })
  })
})
