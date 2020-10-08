import React from 'react'
import Crud, { CrudProps } from '.'
import { DataProvider } from '../../utils/DataContext'

export default (props: CrudProps) => {
  return (
    <DataProvider itemId={props.itemId}>
      <Crud {...props} />
    </DataProvider>
  )
}
