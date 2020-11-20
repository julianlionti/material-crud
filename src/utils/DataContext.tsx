import React, {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

// export interface DataConfigProps {
//   columns: ColumnsProps[]
//   extraActions?: ReactNode[]
// }

interface ProviderProps /* extends DataConfigProps */ {
  children: ReactNode
  itemId?: 'id' | '_id' | string
}

export interface ReplaceProps<T = any> {
  items: T[]
  pagination: PaginationProps
}

export interface PaginationProps {
  hasNextPage?: boolean
  nextPage?: number
  page: number
  limit?: number
  totalDocs?: number
  totalPages?: number
}

interface ContextProps<T = any> /* extends DataConfigProps */ {
  list: T[]
  pagination: PaginationProps
  itemId: 'id' | '_id' | string
}

type Context = [ContextProps, Dispatch<SetStateAction<ContextProps>>]

const intials: ContextProps = {
  list: [],
  pagination: { page: 1, limit: 10 },
  itemId: '_id',
  // columns: [],
}

const DataContext = createContext<Context>([intials, () => {}])

export const DataProvider = (props: ProviderProps) => {
  const { children, itemId } = props
  const status = useState<ContextProps>({
    ...intials,
    itemId: itemId || '_id',
  })

  return <DataContext.Provider value={status}>{children}</DataContext.Provider>
}

export interface ABMResponse<T> {
  addItems: (items: T) => void
  editItem: ({ id, item }: { id: string; item: T }) => void
  deleteItem: (id: string) => void
  replaceItem: ({ pagination, items }: ReplaceProps<T>) => void
  insertItemIndex: (index: number, item: T) => void
  removeItemIndex: (index: number) => void
}

export const useABM = <T extends object>() => {
  const [config, setConfig] = useContext(DataContext) as Context

  const setIsLoading = useCallback(
    (isLoading: boolean) => setConfig((acc) => ({ ...acc, isLoading })),
    [setConfig],
  )

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
      setConfig(({ list, ...etc }) => {
        const index = list.findIndex((e: any) => e[etc.itemId] === id)
        return {
          ...etc,
          list: list.map((e, i) => {
            if (i === index) return item
            else return e
          }),
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
    ({ pagination, items }: ReplaceProps) =>
      setConfig((acc) => ({ ...acc, pagination, list: items })),
    [setConfig],
  )

  const insertIndex = useCallback(
    (index: number, item: T) => {
      setConfig(({ list, ...etc }) => ({
        ...etc,
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

  return { add, edit, deleteCall, replace, insertIndex, removeIndex, ...config, setIsLoading }
}
