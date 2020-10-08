import React, {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

interface ProviderProps {
  children: ReactNode
  itemId?: 'id' | '_id' | string
}

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
  itemId: 'id' | '_id' | string
}

type Context = [ContextProps, Dispatch<SetStateAction<ContextProps>>]

const intials: ContextProps = {
  list: [],
  pagination: { page: 1, limit: 10 },
  itemId: '_id',
}

const DataContext = createContext<Context>([intials, () => {}])

export const DataProvider = ({ children, itemId }: ProviderProps) => {
  const status = useState<ContextProps>({ ...intials, itemId: itemId || '_id' })
  return <DataContext.Provider value={status}>{children}</DataContext.Provider>
}

export const useABM = <T extends object>() => {
  const [config, setConfig] = useContext(DataContext) as Context

  const add = useCallback(
    (items: T[]) => {
      setConfig((acc) => {
        const list = [
          ...items.filter(
            (it: any) => !acc.list.some((ac: any) => ac[acc.itemId] === it[acc.itemId]),
          ),
          ...acc.list,
        ]
        return {
          ...acc,
          list,
          pagination: {
            ...acc.pagination,
            totalDocs: (acc.pagination.totalDocs || 0) + 1,
          },
        }
      })
    },
    [setConfig],
  )

  const edit = useCallback(
    ({ id, item }: { id: string; item: T }) => {
      setConfig(({ list, pagination, itemId }) => {
        const index = list.findIndex((e: any) => e[itemId] === id)
        return {
          itemId,
          list: list.map((e, i) => {
            if (i === index) return item
            else return e
          }),
          pagination,
        }
      })
    },
    [setConfig],
  )

  const deleteCall = useCallback(
    (id: string) => {
      setConfig((acc) => ({
        ...acc,
        list: acc.list.filter((e: any) => e[acc.itemId] !== id),
        pagination: { ...acc.pagination, totalDocs: (acc.pagination.totalDocs || 1) - 1 },
      }))
    },
    [setConfig],
  )

  const replace = useCallback(
    (items: T[], pagination: PaginationProps) =>
      setConfig((acc) => ({ pagination, list: items, itemId: acc.itemId })),
    [setConfig],
  )

  const insertIndex = useCallback(
    (index: number, item: {}) => {
      setConfig(({ list, pagination, itemId }) => ({
        itemId,
        pagination,
        list: [...list.slice(0, index), item, ...list.slice(index)],
      }))
    },
    [setConfig],
  )

  const removeIndex = useCallback(
    (index: number) => {
      setConfig((acc) => ({
        ...acc,
        list: acc.list.filter((_, i) => i !== index),
      }))
    },
    [setConfig],
  )

  return { add, edit, deleteCall, replace, insertIndex, removeIndex, ...config }
}
