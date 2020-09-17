import React, { ReactNode } from 'react'

import Crud from './components/ABM'
import Form from './components/Formulario'

import CenteredCard from './components/UI/CenteredCard'
import Dialog from './components/UI/Dialog'

import { ABMProvider, useABM } from './utils/ABMContext'
import useAxios, { llamarWS } from './utils/useAxios'
import useWindowSize from './utils/useWindowSize'

export {
  Crud,
  CenteredCard,
  Form,
  Dialog,
  ABMProvider,
  useABM,
  useAxios,
  llamarWS,
  useWindowSize,
}
// export * as Form from './components/Formulario'
// export * as CenteredCard from './components/UI/CenteredCard'
// export * as Dialog from './components/UI/Dialog'
// export * as ABMContext from './utils/ABMContext'
// export * as useAxios from './utils/useAxios'
// export * as useWindowSize from './utils/useWindowSize'
// export const sarasa = () => {
//   return 'Vamo Racing'
// }

// module.exports = {
//   CRUD: require('./components/ABM')
// }
