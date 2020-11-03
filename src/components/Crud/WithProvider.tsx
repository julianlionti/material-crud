import React, { useMemo } from 'react'
import Crud, { CrudProps } from '.'
import { DataProvider, DataConfigProps } from '../../utils/DataContext'

type Props = DataConfigProps & CrudProps

export default (props: Props) => {
  const { fields, columns, filters, itemId, extraActions, steps } = props
  const finalFilters = useMemo(
    () =>
      filters?.map((cam) => {
        if (Array.isArray(cam)) {
          return cam.map((e) => ({ ...e, filter: true }))
        }
        return { ...cam, filter: true }
      }),
    [filters],
  )

  return (
    <DataProvider
      itemId={itemId}
      columns={columns}
      fields={fields}
      filters={finalFilters}
      steps={steps}
      extraActions={extraActions}>
      <Crud {...props} />
    </DataProvider>
  )
}
