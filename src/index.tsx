import React, { ReactNode } from 'react'

import Crud from './components/ABM'
import Form from './components/Formulario'
import { Tipos } from './components/Formulario/Tipos'

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
  Tipos,
}
