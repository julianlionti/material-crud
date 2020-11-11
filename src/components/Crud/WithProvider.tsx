import React, { useMemo } from 'react'
import Crud, { CrudProps } from '.'
import { DataProvider } from '../../utils/DataContext'

// type Props = DataConfigProps & */CrudProps

export default (props: CrudProps) => {
  const { filters, itemId } = props
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
}
