import { useReducer, useRef, useCallback, useEffect } from 'react'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { useUser } from './CrudContext'

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

export const callWs = async <T extends any>(config: AxiosRequestConfig, headers?: any | null) => {
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
      error = { error: { code: 500, message: 'Error en el servidor' } }
    } else {
      error = response?.data
    }
    status = response?.status
  }

  return { error, response, status }
}

export default <T extends any = any>(props?: useAxiosProps): Response<T> => {
  const { onInit, onError } = props || {}
  // const { enqueueSnackbar } = useSnackbar()
  const onInitRef = useRef(false)
  const calling = useRef(false)
  const [state, dispatch] = useReducer(reducer, initial)
  const { headers } = useUser()

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

      dispatch({ error: undefined })
    }
  }, [error, onError])

  const call = useCallback(
    async (config: AxiosRequestConfig) => {
      if (!calling.current) {
        calling.current = true
        dispatch({ loading: true, error: undefined, response: undefined })
        const { error, response, status } = await callWs(config, headers)
        dispatch({ loading: false, response, error })
        calling.current = false
        return { response, error, status }
      }
      return {}
    },
    [headers],
  )

  useEffect(() => {
    if (!onInitRef.current && onInit) {
      call(onInit)
      onInitRef.current = true
    }
  }, [onInit, call])

  return { call, ...state }
}
