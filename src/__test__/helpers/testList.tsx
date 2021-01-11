/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  act,
  fireEvent,
  queryByLabelText,
  queryAllByLabelText,
  RenderResult,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { CrudProps } from '../../components/Crud'
import { FormTypes } from '../../components/Form/FormTypes'
import { Translations } from '../../translate'
import AriaLabels from '../../utils/AriaLabels'

interface ProviderProps {
  lang: Translations
  crudElement: RenderResult
  fakeData: any
}

// type NoResponseProps = Omit<CrudProps, 'response'>

export default async <T extends object = object>(props: CrudProps & ProviderProps) => {
  const {
    lang,
    crudElement,
    filters,
    extraActions,
    columns,
    actions,
    fakeData,
    response,
    interaction,
  } = props
  const { queryByText } = crudElement
  const listTitle = queryByText(lang.listOf, { exact: false })
  expect(listTitle).toBeTruthy()

  let filterButton = queryByText(`${lang.open} ${lang.filters}`, { exact: false })?.parentElement
  expect(filterButton).toBeTruthy()
  if (!filterButton) return
  fireEvent.click(filterButton)
  await act(async () => {})

  if (filters) {
    const filtersInputs = crudElement.queryAllByLabelText(AriaLabels.BaseInput)
    expect(filtersInputs.length).toEqual(filters.length)

    filtersInputs.forEach((filterInput, i) => {
      const { type } = filters.flat()[i]
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

    filterButton = queryByText(`${lang.close} ${lang.filters}`, { exact: false })?.parentElement
    expect(filterButton).toBeTruthy()
  }

  const header = crudElement.queryByLabelText(AriaLabels.RowHeader)
  expect(header).toBeTruthy()

  const rows = crudElement.queryAllByLabelText(AriaLabels.RowContent)
  expect(rows.length).toBe(10)

  const [firstRow] = rows
  const cells = queryAllByLabelText(firstRow, AriaLabels.CellContent)
  const hasEstraActions = !!extraActions
  expect(cells.length).toBe(
    columns.length +
      (actions?.delete || actions?.edit || actions?.pinToTop || hasEstraActions ? +1 : 0),
  )

  const getTotalDocs = () => {
    const docsEl = crudElement.queryByLabelText(AriaLabels.Pagination.Docs)
    return parseInt(docsEl?.getAttribute('aria-valuetext') || '0')
  }

  const allDocs = getTotalDocs()

  if (actions?.delete) {
    const deleteBtn = queryByLabelText(firstRow, AriaLabels.Actions.DelButton)
    expect(deleteBtn).toBeTruthy()
    fireEvent.click(deleteBtn!!)

    const openDialog = async () => {
      fireEvent.click(deleteBtn!!)
      const dialogEl = await waitFor(() => screen.queryByLabelText(AriaLabels.Dialog.Root))
      expect(dialogEl).toBeTruthy()
      const NoBtn = queryByLabelText(dialogEl!!, AriaLabels.Dialog.NoBtn)
      const YesBtn = queryByLabelText(dialogEl!!, AriaLabels.Dialog.YesBtn)
      expect(NoBtn).toBeTruthy()
      expect(YesBtn).toBeTruthy()
      return { NoBtn: NoBtn!!, YesBtn: YesBtn!! }
    }

    let dialog = await openDialog()
    fireEvent.click(dialog.NoBtn)
    await waitForElementToBeRemoved(screen.queryByLabelText(AriaLabels.Dialog.Root))
    dialog = await openDialog()
    fireEvent.click(dialog.YesBtn)
    await waitForElementToBeRemoved(screen.queryByLabelText(AriaLabels.Dialog.Root))

    expect(crudElement.queryAllByLabelText(AriaLabels.RowContent).length).toBe(9)
  }

  const afterDeleteDocs = getTotalDocs()
  expect(afterDeleteDocs).toBe(allDocs - 1)

  if (actions?.edit) {
    expect(queryByLabelText(firstRow, AriaLabels.Actions.EditButton)).toBeTruthy()
  }
}
