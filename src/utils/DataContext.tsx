import React, {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

export interface PaginationProps {
  hasNextPage?: boolean
  nextPage?: number
  page: number
  limit?: number
  totalDocs?: number
  totalPages?: number
}

interface ContextProps<T = any> {
  list: T[]
  pagination: PaginationProps
}

type Context<T = any> = [ContextProps, Dispatch<SetStateAction<ContextProps>>]

const DataContext = createContext<Context>([
  { list: [], pagination: { page: 1 } },
  () => {},
])

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const status = useState<ContextProps>({ list: [], pagination: { page: 1 } })
  return <DataContext.Provider value={status}>{children}</DataContext.Provider>
}

export interface UseProps<T> {
  id?: keyof T
}

export const useABM = <T extends object>(props?: UseProps<T>) => {
  const key = props?.id || '_id'
  const [config, setConfig] = useContext(DataContext) as Context<T>

  const add = useCallback(
    (items: T[]) => {
      const anyKey = key as any
      setConfig((acc) => {
        const list = [
          ...items.filter(
            (it: any) => !acc.list.some((ac: any) => ac[anyKey] === it[anyKey]),
          ),
          ...acc.list,
        ]
        return {
          list,
          pagination: {
            ...acc.pagination,
            totalDocs: (acc.pagination.totalDocs || 0) + 1,
          },
        }
      })
    },
    [key, setConfig],
  )

  const edit = useCallback(
    ({ id, item }: { id: string; item: T }) => {
      const anyKey = key as any
      setConfig(({ list, pagination }) => {
        const index = list.findIndex((e: any) => e[anyKey] === id)
        return {
          list: list.map((e, i) => {
            if (i === index) return item
            else return e
          }),
          pagination,
        }
      })
    },
    [key, setConfig],
  )

  const deleteCall = useCallback(
    (id: string) => {
      const anyKey = key as any
      setConfig((acc) => ({
        list: acc.list.filter((e: any) => e[anyKey] !== id),
        pagination: { ...acc.pagination, totalDocs: (acc.pagination.totalDocs || 1) - 1 },
      }))
    },
    [key, setConfig],
  )

  const replace = useCallback(
    (items: T[], pagination: PaginationProps) => setConfig({ pagination, list: items }),
    [setConfig],
  )

  return { add, edit, deleteCall, replace, ...config }
}
