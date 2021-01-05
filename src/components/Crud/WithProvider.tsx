import React, { forwardRef, useMemo } from 'react'
import Crud, { CrudProps, RefProps } from '.'
import { DataProvider } from '../../utils/DataContext'

// type Props = DataConfigProps & */CrudProps

export default forwardRef<RefProps, CrudProps>((props, ref) => {
  const { filters, itemId, name, actions } = props
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
    <DataProvider itemId={itemId} name={name} withPin={!!actions?.pinToTop}>
      <Crud ref={ref} {...props} filters={finalFilters} />
    </DataProvider>
  )
})
