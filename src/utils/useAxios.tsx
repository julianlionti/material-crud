import { useReducer, useRef, useCallback, useEffect } from 'react'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { useUser } from '../components/User'
// import { useSnackbar } from 'notistack'

export interface Error {
  mensaje: string
  codigo: number
}

interface Props {
  alIniciar?: AxiosRequestConfig
  onError?: (error: Error) => void
}

interface Respuesta<T> extends Estado<T> {
  llamar: (props: AxiosRequestConfig, conAuth?: boolean) => void
}

export interface ErrorRespuesta {
  error?: Error
  errores?: Error[]
}

interface Estado<T = any> {
  cargando?: boolean
  error?: ErrorRespuesta
  respuesta?: T
}

const inicial: Estado = {
  cargando: false,
}

const reducer = (estado: Estado, accion: Estado): Estado => ({
  ...estado,
  ...accion,
})

export const llamarWS = async <T extends any>(
  config: AxiosRequestConfig,
  headers?: any | null,
) => {
  let respuesta: undefined | T
  let error: undefined | ErrorRespuesta

  try {
    let final = config
    if (headers) {
      final = {
        ...final,
        headers: { ...config.headers, ...headers },
      }
    }
    const { data } = await axios(final)
    respuesta = data
  } catch (ex) {
    const { response } = ex as AxiosError<ErrorRespuesta>
    if (response?.status === 500) {
      error = { error: { codigo: 500, mensaje: 'Error en el servidor' } }
    } else {
      error = response?.data
    }
  }

  return { error, respuesta }
}

export default <T extends any>(props?: Props): Respuesta<T> => {
  const { alIniciar, onError } = props || {}
  // const { enqueueSnackbar } = useSnackbar()
  const alIniciarRef = useRef(false)
  const llamando = useRef(false)
  const [state, dispatch] = useReducer(reducer, inicial)
  const { headers } = useUser()

  const { error } = state
  useEffect(() => {
    if (onError && error) {
      if (error.error) {
        onError(error.error)
      }
      if (error.errores) {
        error.errores!!.forEach((err) => {
          onError(err)
        })
      }

      dispatch({ error: undefined })
    }
  }, [error, onError])

  const llamar = useCallback(
    async (config: AxiosRequestConfig) => {
      if (!llamando.current) {
        llamando.current = true
        dispatch({ cargando: true, error: undefined, respuesta: undefined })
        const { error, respuesta } = await llamarWS(config, headers)
        dispatch({ cargando: false, respuesta, error })
        llamando.current = false
      }
    },
    [headers],
  )

  useEffect(() => {
    if (!alIniciarRef.current && alIniciar) {
      llamar(alIniciar)
      alIniciarRef.current = true
    }
  }, [alIniciar, llamar])

  return { llamar, ...state }
}
