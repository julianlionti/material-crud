import React from 'react'
import { act, cleanup, fireEvent, render, queryByLabelText } from '@testing-library/react'
import Axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Crud from '../components/Crud/WithProvider'
import { createFields } from '../components/Form'
import { FormTypes } from '../components/Form/FormTypes'
import { createColumns } from '../components/Table'
import { enUS } from '../translate/en_us'
import AriaLabels from '../utils/AriaLabels'
import { CrudProvider } from '../utils/CrudContext'

import { fakeData } from './generators'

jest.mock('react-virtualized-auto-sizer', () => ({ children }: any) =>
  children({ height: 600, width: 600 }),
)
jest.setTimeout(30000)
const mock = new MockAdapter(Axios)
mock.onGet().reply(200, fakeData())

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

    const { queryByText, ...crudElement } = render(
      <CrudProvider lang={currentLang}>
        <Crud
          url={url}
          itemId="_id"
          description={description}
          name={name}
          fields={fields}
          columns={columns}
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
    if (!filterButton) return
    await fireEvent.click(filterButton)
    await act(async () => {})

    const fieldsWithFilter = fields.flat().filter((field) => {
      if (field.type === FormTypes.Expandable) return false
      return field.filter
    })
    const filters = crudElement.queryAllByLabelText(AriaLabels.BaseInput)
    expect(filters.length).toEqual(fieldsWithFilter.length)

    filters.forEach((filterInput, i) => {
      const { type } = fieldsWithFilter[i]
      if (
        type === FormTypes.Autocomplete ||
        type === FormTypes.Input ||
        type === FormTypes.Email ||
        type === FormTypes.Multiline ||
        type === FormTypes.Number ||
        type === FormTypes.Phone ||
        type === FormTypes.Options
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
