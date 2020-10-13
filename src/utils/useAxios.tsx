import { useReducer, useRef, useCallback, useEffect } from 'react'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { useLang, useUser } from './CrudContext'
import { Translations } from '../translate'

export interface Error {
  message: string
  code: number
}

export interface useAxiosProps {
  onInit?: AxiosRequestConfig
  onError?: (error: Error) => void
}

export type CallProps = (props: AxiosRequestConfig, authorize?: boolean) => Promise<CallResponse>
interface Response<T> extends Status<T> {
  call: CallProps
}

export interface ErrorResponse {
  error?: Error
  errors?: Error[]
}

interface Status<T = any> {
  loading?: boolean
  error?: ErrorResponse
  response?: T
  status?: number
}

export interface CallResponse<T = any> {
  error?: ErrorResponse
  response?: T
  status?: number
}

const initial: Status = {
  loading: false,
}

const reducer = (status: Status, action: Status): Status => ({
  ...status,
  ...action,
})

export const callWs = async <T extends any>(
  config: AxiosRequestConfig,
  headers?: any | null,
  lang?: Translations,
) => {
  let response: undefined | T
  let error: undefined | ErrorResponse
  let status: undefined | number

  try {
    let final = config
    if (headers) {
      final = {
        ...final,
        headers: { ...config.headers, ...headers },
      }
    }
    const { data, status: s } = await axios(final)
    response = data
    status = s
  } catch (ex) {
    const { response } = ex as AxiosError<ErrorResponse>
    if (response?.status === 500) {
      error = { error: { code: 500, message: lang?.serverError || 'Error en el servidor' } }
    } else {
      error = response?.data || { error: { code: 501, message: 'Error' } }
    }
    status = response?.status
  }

  return { error, response, status }
}

export default <T extends any = any>(props?: useAxiosProps): Response<T> => {
  const { onInit, onError } = props || {}
  const onInitRef = useRef(false)
  const calling = useRef(false)
  const [state, dispatch] = useReducer(reducer, initial)
  const { headers } = useUser()
  const lang = useLang()

  const { error } = state
  useEffect(() => {
    if (onError && error) {
      if (error.error) {
        onError(error.error)
      }
      if (error.errors) {
        error.errors!!.forEach((err) => {
          onError(err)
        })
      }

      dispatch({ error: undefined, status: undefined })
    }
  }, [error, onError])

  const call = useCallback(
    async (config: AxiosRequestConfig) => {
      if (!calling.current) {
        calling.current = true
        dispatch({ loading: true, error: undefined, response: undefined, status: undefined })
        const { error, response, status } = await callWs(config, headers, lang)
        dispatch({ loading: false, response, error, status: status })
        calling.current = false
        return { response, error, status }
      }
      return {}
    },
    [headers, lang],
  )

  useEffect(() => {
    if (!onInitRef.current && onInit) {
      call(onInit)
      onInitRef.current = true
    }
  }, [onInit, call])

  return { call, ...state }
}
