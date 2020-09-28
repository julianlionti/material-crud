import React, {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

type Context<T = any> = [T[], Dispatch<SetStateAction<T[]>>]

const ABMContext = createContext<Context>([[], () => {}])

export const ABMProvider = ({ children }: { children: ReactNode }) => {
  const status = useState<any>([])
  return <ABMContext.Provider value={status}>{children}</ABMContext.Provider>
}

export interface UseProps<T> {
  id?: keyof T
}

export const useABM = <T extends object>(props: UseProps<T>) => {
  const key = props.id || '_id'
  const [list, setList] = useContext(ABMContext) as Context<T>

  const add = useCallback(
    (items: T[]) => {
      const anyKey = key as any
      setList((acc) => {
        return [
          ...items.filter(
            (it: any) =>
              !acc.some((ac: any) => {
                return ac[anyKey] === it[anyKey]
              }),
          ),
          ...acc,
        ]
      })
    },
    [key, setList],
  )

  const edit = useCallback(
    ({ id, item }: { id: string; item: T }) => {
      const anyKey = key as any
      setList((acc) => {
        const index = acc.findIndex((e: any) => e[anyKey] === id)
        return acc.map((e, i) => {
          if (i === index) return item
          else return e
        })
      })
    },
    [key, setList],
  )

  const deleteCall = useCallback(
    (id: string) => {
      const anyKey = key as any
      setList((acc) => acc.filter((e: any) => e[anyKey] !== id))
    },
    [key, setList],
  )

  const replace = useCallback(
    (items: T[]) => {
      setList(items)
    },
    [setList],
  )

  return { list, add, edit, deleteCall, replace }
}
