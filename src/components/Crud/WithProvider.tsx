import React, { memo, useMemo } from 'react'
import Crud, { CrudProps } from '.'
import { DataProvider, DataConfigProps } from '../../utils/DataContext'

type Props = DataConfigProps & CrudProps

export default memo((props: Props) => {
  const { columns, filters, itemId, extraActions } = props
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
    <DataProvider itemId={itemId} columns={columns} extraActions={extraActions}>
      <Crud {...props} filters={finalFilters} />
    </DataProvider>
  )
})
