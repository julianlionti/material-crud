import { createResponseConf } from './components/Crud'
import { createMoreOptions } from './components/Crud/Toolbar'
import Crud from './components/Crud/WithProvider'
import Form, { createFields, createSteps } from './components/Form'
import { FormTypes } from './components/Form/FormTypes'
import { createColumns, createExtraActions } from './components/Table'

import { TableTypes } from './components/Table/TableTypes'
import CenteredCard from './components/UI/CenteredCard'
import Dialog from './components/UI/Dialog'
import { createTranslation } from './translate'

import { enUS } from './translate/en_us'
import { esAR } from './translate/es_ar'
import { CrudProvider, useUser, useLang } from './utils/CrudContext'
import { DataProvider, useABM } from './utils/DataContext'
import Storage from './utils/Storage'
import useAxios, { useAxiosAr, callWs } from './utils/useAxios'
import useWindowSize from './utils/useWindowSize'

export type { CustomComponentProps } from './components/Form/AlCustom'
export type { UseAxiosProps, CallProps, Error, ErrorResponse } from './utils/useAxios'
export type { OpcionesProps } from './components/Form/FormTypes'
export type { RefProps as CrudRefProps, CrudProps } from './components/Crud/index'

export {
  Crud,
  CenteredCard,
  Form,
  Dialog,
  DataProvider,
  useABM,
  useAxios,
  useAxiosAr,
  callWs,
  useWindowSize,
  createSteps,
  createFields,
  createColumns,
  createTranslation,
  createResponseConf,
  createExtraActions,
  CrudProvider,
  useUser,
  useLang,
  esAR,
  enUS,
  FormTypes,
  TableTypes,
  createMoreOptions,
  Storage,
}
