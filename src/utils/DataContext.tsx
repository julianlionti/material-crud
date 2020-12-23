import React, {
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from 'react'
import Storage from './Storage'

// export interface DataConfigProps {
//   columns: ColumnsProps[]
//   extraActions?: ReactNode[]
// }

interface ProviderProps /* extends DataConfigProps */ {
  children: ReactNode
  itemId?: 'id' | '_id' | string
  name: string
  withPin: boolean
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
  name: string
  pins: any[]
}

type Context = [ContextProps, Dispatch<SetStateAction<ContextProps>>]

const intials: ContextProps = {
  list: [],
  pagination: { page: 1, limit: 10 },
  itemId: '_id',
  name: '',
  pins: [],
  // columns: [],
}

const DataContext = createContext<Context>([intials, () => {}])

export const DataProvider = (props: ProviderProps) => {
  const { children, itemId, name, withPin } = props
  const pinName = `${name}-pin`
  const status = useState<ContextProps>({
    ...intials,
    itemId: itemId || '_id',
    name,
    pins: Storage.getItem(pinName) || [],
  })

  const [{ pins }, setStatus] = status
  useEffect(() => {
    setStatus((sta) => ({ ...sta, name }))
  }, [name, setStatus])

  useEffect(() => {
    if (withPin) {
      Storage.saveItem(pinName, pins)
    }
  }, [withPin, pinName, pins])

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
  const { itemId } = config
  // const [pins, setPins] = useState<any[]>(() => Storage.getItem(name) || [])

  const setIsLoading = useCallback(
    (isLoading: boolean) => setConfig((acc) => ({ ...acc, isLoading })),
    [setConfig],
  )

  const { pins, list } = config
  const finalList = useMemo(() => {
    return [...pins, ...list.filter((l) => !pins.some((e) => e[itemId] === l[itemId]))]
  }, [list, pins, itemId])

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
      setConfig((acc) => ({
        ...acc,
        list: [...finalList.slice(0, index), item, ...finalList.slice(index)],
      }))
    },
    [setConfig, finalList],
  )

  const removeIndex = useCallback(
    (index: number) => {
      setConfig((acc) => ({
        ...acc,
        list: finalList.filter((_, i) => i !== index),
      }))
    },
    [setConfig, finalList],
  )

  const savePins = useCallback(
    (value: any | any[]) => {
      setConfig((acc) => {
        let newPins = acc.pins
        if (Array.isArray(value)) newPins = [...newPins, ...value]
        if (!newPins.includes(value)) newPins = [...newPins, value]

        return { ...acc, pins: newPins }
      })
    },
    [setConfig],
  )

  const removePins = useCallback(
    (id?: string | string[]) => {
      setConfig((acc) => {
        let newPins = acc.pins
        if (!id) {
          newPins = []
        } else {
          newPins = newPins.filter((val) =>
            Array.isArray(id) ? !id.includes(val[itemId]) : val[itemId] !== id,
          )
        }

        return { ...acc, pins: newPins }
      })
    },
    [setConfig, itemId],
  )

  return {
    add,
    edit,
    deleteCall,
    replace,
    insertIndex,
    removeIndex,
    ...config,
    list: finalList,
    setIsLoading,
    savePins,
    removePins,
  }
}
