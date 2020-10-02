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

interface Context<T = any> {
  user?: T | null
  headers?: {} | null
  lang?: Translations | null
}

interface ProviderProps<T> extends Context<T> {
  children: ReactNode
  onUser?: (user: T | null) => void
}

const CrudContext = createContext<[Context, Dispatch<SetStateAction<Context>>]>([
  {},
  () => {},
])

export const CrudProvider = <T extends any>({
  children,
  onUser,
  ...context
}: ProviderProps<T>) => {
  const state = useState<Context<T>>(context)
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

  const setUser = useCallback(
    (user: T | null) => setConfiguration((conf) => ({ ...conf, user })),
    [setConfiguration],
  )

  const setHeaders = useCallback(
    (headers: any) => setConfiguration((conf) => ({ ...conf, headers })),
    [setConfiguration],
  )

  return { user: configuration.user, headers: configuration.headers, setUser, setHeaders }
}

/* import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Translations } from '../../translate'

export interface Configuration<T = any> {
  user: null | T
  headers: null | any
}

interface ProviderProps<T = any> {
  children: ReactNode
  intial?: Configuration
  lang?: Translations
  onUser?: (user: T | null) => void
}

interface ContextProps<T = any> {
  configuration: [Configuration<T>, Dispatch<SetStateAction<Configuration<T>>>]
  lang?: Translations
  onUser?: (user: T | null) => void
}

const intialValue: ContextProps = {
  configuration: [
    {
      user: null,
      headers: null,
    },
    () => {},
  ],
}

const UserContext = createContext<ContextProps>(intialValue)

export const UserProvider = ({ children, intial, onUser, lang }: ProviderProps) => {
  const configuration = useState<Configuration>(intial || intialValue)
  return (
    <UserContext.Provider value={{ configuration, onUser, lang }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = <T extends any>() => {
  const [configuration, setConfiguration] = useContext(UserContext) as Contexto<T>

  const setUser = useCallback(
    (user: T | null) => setConfiguration((conf) => ({ ...conf, user })),
    [setConfiguration],
  )

  const setHeaders = useCallback(
    (headers: any) => setConfiguration((conf) => ({ ...conf, headers })),
    [setConfiguration],
  )

  const { user, onUser } = configuration
  useEffect(() => {
    if (onUser) {
      onUser(user)
    }
  }, [user, onUser])

  return { user: configuration.user, headers: configuration.headers, setUser, setHeaders }
}
*/
