import React from 'react'
import {
  act,
  cleanup,
  fireEvent,
  render,
  queryByLabelText,
  waitFor,
  screen,
} from '@testing-library/react'
import Crud from '../components/Crud/WithProvider'
import { createFields } from '../components/Form'
import { Types } from '../components/Form/Types'
import { CrudProvider } from '../utils/CrudContext'
import { enUS } from '../translate/en_us'
import AriaLabels from '../utils/AriaLabels'

import MockAdapter from 'axios-mock-adapter'
import Axios from 'axios'
import { fakeData } from './generators'

jest.mock('react-virtualized-auto-sizer', () => ({ children }: any) =>
  children({ height: 600, width: 600 }),
)
jest.setTimeout(30000)
var mock = new MockAdapter(Axios)
mock.onGet().reply(200, fakeData())

describe('CrudComponent FakeData AlimentAPP', () => {
  beforeEach(cleanup)

  it('Deberia andar bien', async () => {
    const currentLang = enUS
    const description = 'Crud de prueba'
    const name = 'Prueba'
    const url = 'http://localhost:5050/api/prueba'

    const fields = createFields(() => [
      [
        {
          id: '_id',
          type: Types.Input,
          title: 'ID',
          filter: true,
          readonly: true,
          list: { width: 10 },
        },
        {
          id: 'nombre',
          type: Types.Input,
          title: 'Nombre',
          list: { width: 30 },
        },
      ],
      {
        id: 'select',
        type: Types.Options,
        options: [
          { id: 'id1', title: 'Titulo 1' },
          { id: 'id2', title: 'Titulo 2' },
        ],
        placeholder: 'Seleccione una prueba',
        title: 'Pruebas',
        filter: true,
        list: { width: 60 },
      },
    ])

    const { queryByText, ...crudElement } = render(
      <CrudProvider lang={currentLang}>
        <Crud
          itemId="_id"
          height={500}
          url={url}
          description={description}
          name={name}
          columns={fields}
          response={{
            list: ({ data }) => ({ items: data.docs, ...data }),
          }}
        />
      </CrudProvider>,
    )
    await act(async () => {})

    const listTitle = queryByText(currentLang.listOf, { exact: false })
    expect(listTitle).toBeTruthy()

    let filterButton = queryByText(`${currentLang.open} ${currentLang.filters}`, { exact: false })
      ?.parentElement
    expect(filterButton).toBeTruthy()

    await fireEvent.click(filterButton!!)
    await act(async () => {})

    const fieldsWithFilter = fields.flat().filter((field) => {
      if (field.type === Types.Expandable) return false
      return field.filter
    })
    const filters = crudElement.queryAllByLabelText(AriaLabels.BaseInput)
    expect(filters.length).toEqual(fieldsWithFilter.length)

    filters.forEach((filterInput, i) => {
      const { type } = fieldsWithFilter[i]
      if (
        type === Types.Autocomplete ||
        type === Types.Input ||
        type === Types.Email ||
        type === Types.Multiline ||
        type === Types.Number ||
        type === Types.Phone ||
        type === Types.Options
      ) {
        const filterType = queryByLabelText(filterInput, AriaLabels.BtnFilterTypes)
        expect(filterType).toBeTruthy()
      }
    })

    filterButton = queryByText(`${currentLang.close} ${currentLang.filters}`, { exact: false })
      ?.parentElement
    expect(filterButton).toBeTruthy()

    const header = crudElement.queryByLabelText(AriaLabels.RowHeader)
    expect(header).toBeTruthy()

    // await new Promise((resolve) => setTimeout(resolve, 20000))
    // await act(async () => {})
    const rows = crudElement.queryAllByLabelText(AriaLabels.RowContent)
    expect(rows.length).toBe(10)
  })
})
