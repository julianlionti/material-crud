import Form, { createFields } from './components/Form'
import { Types } from './components/Form/Types'

import CenteredCard from './components/UI/CenteredCard'
import Dialog from './components/UI/Dialog'
import { createTranslation } from './translate'

import { DataProvider, useABM } from './utils/DataContext'
import useAxios, { callWs } from './utils/useAxios'
import useWindowSize from './utils/useWindowSize'

import { CrudProvider, useUser, useLang } from './utils/CrudContext'
import AlTable from './components/Crud/TableWindow'
import Crud from './components/Crud/WithProvider'

import { esAR } from './translate/es_ar'
import { enUS } from './translate/en_us'

export type { CRUD as CrudItem } from './components/Crud'
export type { CustomComponentProps } from './components/Form/AlCustom'
export type { TableProps } from './components/Crud/TableWindow'
export type { useAxiosProps } from './utils/useAxios'

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
  CrudProvider,
  useUser,
  useLang,
  AlTable as CrudTable,
  esAR,
  enUS,
}
