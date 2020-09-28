import { useReducer, useRef, useCallback, useEffect } from 'react'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'
// import { useSnackbar } from 'notistack'

export interface Error {
  message: string
  code: number
}

interface Props {
  onInit?: AxiosRequestConfig
  onError?: (error: Error) => void
}

interface Response<T> extends Status<T> {
  call: (props: AxiosRequestConfig, authorize?: boolean) => void
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

const initial: Status = {
  loading: false,
}

const reducer = (status: Status, action: Status): Status => ({
  ...status,
  ...action,
})

export const callWs = async <T extends any>(
  config: AxiosRequestConfig,
  user?: any | null,
) => {
  let response: undefined | T
  let error: undefined | ErrorResponse

  try {
    let final = config
    if (user) {
      const headers = {
        Authorization: user.token,
      }
      final = {
        ...final,
        headers: { ...config.headers, ...headers },
      }
    }
    const { data } = await axios(final)
    response = data
  } catch (ex) {
    const { response } = ex as AxiosError<ErrorResponse>
    if (response?.status === 500) {
      error = { error: { code: 500, message: 'Error en el servidor' } }
    } else {
      error = response?.data
    }
  }

  return { error, response }
}

export default <T extends any>(props?: Props): Response<T> => {
  const { onInit, onError } = props || {}
  // const { enqueueSnackbar } = useSnackbar()
  const onInitRef = useRef(false)
  const calling = useRef(false)
  const [state, dispatch] = useReducer(reducer, initial)

  const { error } = state
  useEffect(() => {
    if (onError && error) {
      if (error.error) {
        onError(error.error)
        // enqueueSnackbar(`${error.error.mensaje} (${error.error.codigo})`, {
        //   variant: 'error',
        // })
      }
      if (error.errors) {
        error.errors!!.forEach((err) => {
          onError(err)
          // enqueueSnackbar(`${err.mensaje} (${err.codigo})`, { variant: 'error' })
        })
      }

      dispatch({ error: undefined })
    }
  }, [error])

  const call = useCallback(async (config: AxiosRequestConfig) => {
    if (!calling.current) {
      calling.current = true
      dispatch({ loading: true, error: undefined, response: undefined })
      const { error, response } = await callWs(config)
      dispatch({ loading: false, response, error })
      calling.current = false
    }
  }, [])

  useEffect(() => {
    if (!onInitRef.current && onInit) {
      call(onInit)
      onInitRef.current = true
    }
  }, [onInit, call])

  return { call, ...state }
}
