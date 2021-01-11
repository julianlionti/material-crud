import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
// import { createFields } from '../components/Form'
// import { createColumns, createExtraActions } from '../components/Table'
import { Translations } from '../translate'
import { enUS } from '../translate/en_us'

interface Context<T = any> {
  user?: T | null
  headers?: {} | null
  lang: Translations
}

interface ProviderProps<T> {
  children: ReactNode
  onUser?: (user: T | null) => void
  user?: T | null
  headers?: {} | null
  lang?: Translations
}

const CrudContext = createContext<[Context, Dispatch<SetStateAction<Context>>]>([
  { lang: enUS },
  () => {},
])

export const CrudProvider = <T extends any>(props: ProviderProps<T>) => {
  const { children, onUser, headers, ...context } = props
  const state = useState<Context<T>>({ ...context, lang: context.lang || enUS, headers })
  const [conf, setConf] = state

  const [{ user }] = state
  useEffect(() => {
    if (onUser && user !== undefined) {
      onUser(user)
      setConf((conf) => ({ ...conf, user, headers }))
    }
  }, [user, onUser, setConf, headers])

  useEffect(() => {
    if (headers) {
      setConf((conf) => ({ ...conf, headers }))
    }
  }, [headers, setConf])

  return <CrudContext.Provider value={state}>{children}</CrudContext.Provider>
}

export const useLang = () => {
  const [configuration] = useContext(CrudContext)
  return configuration.lang
}

/*
export const useCrud = () => {
  const createExtraActionsCall = useCallback(createExtraActions, [])
  const createColumnsCall = useCallback(createColumns, [])
  const createFieldsCall = useCallback(createFields, [])

  return {
    createExtraActions: createExtraActionsCall,
    createColumns: createColumnsCall,
    createFields: createFieldsCall,
  }
} */

export const useUser = <T extends any = any>() => {
  const [configuration, setConfiguration] = useContext(CrudContext)
  const setUser = useCallback((user: T | null) => setConfiguration((conf) => ({ ...conf, user })), [
    setConfiguration,
  ])

  const setHeaders = useCallback(
    (headers: any) => setConfiguration((conf) => ({ ...conf, headers })),
    [setConfiguration],
  )

  return {
    user: configuration.user as T,
    headers: configuration.headers,
    setUser,
    setHeaders,
  }
}
