import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react'

export interface Configuration<T = any> {
  user: null | T
  headers: null | any
}

interface ProviderProps {
  children: ReactNode
  intial?: Configuration
}

type Contexto<T = any> = [Configuration<T>, Dispatch<SetStateAction<Configuration<T>>>]

const intialValue: Configuration = {
  user: null,
  headers: null,
}

const UserContext = createContext<Contexto>([intialValue, () => {}])

export const UserProvider = ({ children, intial }: ProviderProps) => {
  const estado = useState<Configuration>(intial || intialValue)
  return <UserContext.Provider value={estado}>{children}</UserContext.Provider>
}

export const useUser = <T extends any>() => {
  const [configuration, setConfiguration] = useContext(UserContext) as Contexto<T>

  const setUser = useCallback(
    (user: T) => setConfiguration((conf) => ({ ...conf, user })),
    [setConfiguration],
  )

  const setHeaders = useCallback(
    (headers: any) => setConfiguration((conf) => ({ ...conf, headers })),
    [setConfiguration],
  )

  return { user: configuration.user, headers: configuration.headers, setUser, setHeaders }
}
