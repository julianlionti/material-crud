import React, { memo, useMemo } from 'react'
import Crud, { CrudProps } from '.'
import { DataProvider } from '../../utils/DataContext'

// type Props = DataConfigProps & */CrudProps

export default memo((props: CrudProps) => {
  const { columns, filters, itemId } = props
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
    <DataProvider itemId={itemId}>
      <Crud {...props} filters={finalFilters} />
    </DataProvider>
  )
})
