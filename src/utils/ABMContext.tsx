import React, {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

type Contexto<T = any> = [T[], Dispatch<SetStateAction<T[]>>]

const ABMContext = createContext<Contexto>([[], () => {}])

export const ABMProvider = ({ children }: { children: ReactNode }) => {
  const estado = useState<any>([])
  return <ABMContext.Provider value={estado}>{children}</ABMContext.Provider>
}

export interface UseProps<T> {
  id?: keyof T
}

export const useABM = <T extends object>(props: UseProps<T>) => {
  const key = props.id || '_id'
  const [listado, setListado] = useContext(ABMContext) as Contexto<T>

  const agregar = useCallback(
    (items: T[]) => {
      const llave = key as any
      setListado((actual) => {
        return [
          ...items.filter(
            (it: any) =>
              !actual.some((ac: any) => {
                return ac[llave] === it[llave]
              }),
          ),
          ...actual,
        ]
      })
    },
    [key, setListado],
  )

  const editar = useCallback(
    ({ id, item }: { id: string; item: T }) => {
      const llave = key as any
      setListado((actual) => {
        const index = actual.findIndex((e: any) => e[llave] === id)
        return actual.map((e, i) => {
          if (i === index) return item
          else return e
        })
      })
    },
    [key, setListado],
  )

  const borrar = useCallback(
    (id: string) => {
      const llave = key as any
      setListado((actual) => actual.filter((e: any) => e[llave] !== id))
    },
    [key, setListado],
  )

  const reemplazar = useCallback(
    (items: T[]) => {
      setListado(items)
    },
    [setListado],
  )

  return { listado, agregar, editar, borrar, reemplazar }
}
