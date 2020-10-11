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

export const CrudProvider = <T extends any>({ children, onUser, ...context }: ProviderProps<T>) => {
  const state = useState<Context<T>>({ ...context, lang: context.lang || enUS })
  const [{ user }] = state
  useEffect(() => {
    if (onUser && user !== undefined) {
      onUser(user)
    }
  }, [user, onUser])
  return <CrudContext.Provider value={state}>{children}</CrudContext.Provider>
}

export const useLang = () => {
  const [configuration] = useContext(CrudContext)
  return configuration.lang
}

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
