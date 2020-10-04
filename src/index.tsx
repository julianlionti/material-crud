import { CRUD as CrudItem } from './components/Crud'
import Form, { createFields } from './components/Form'
import { Types } from './components/Form/Types'

import CenteredCard from './components/UI/CenteredCard'
import Dialog from './components/UI/Dialog'
import { createTranslation } from './translate'

import { DataProvider, useABM } from './utils/DataContext'
import useAxios, { callWs } from './utils/useAxios'
import useWindowSize from './utils/useWindowSize'
import { CustomComponentProps } from './components/Form/AlCustom'

import { CrudProvider, useUser, useLang } from './utils/CrudContext'
import AlTable, { TableProps } from './components/Crud/AlTable'
import Crud from './components/Crud/WithProvider'

import { esAR } from './translate/es_ar'

export {
  Crud,
  CenteredCard,
  Form,
  Dialog,
  DataProvider,
  useABM,
  useAxios,
  callWs,
  useWindowSize,
  Types,
  createFields,
  createTranslation,
  CrudItem,
  CustomComponentProps,
  CrudProvider,
  useUser,
  useLang,
  TableProps,
  AlTable as CrudTable,
  esAR,
}
