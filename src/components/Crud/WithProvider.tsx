import React from 'react'
import Crud, { CrudProps } from '.'
import { DataProvider } from '../../utils/DataContext'

export default (props: CrudProps) => {
  return (
    <DataProvider>
      <Crud {...props} />
    </DataProvider>
  )
}
