import { useReducer, useRef, useCallback, useEffect } from 'react'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'
// import { useSnackbar } from 'notistack'

interface Props {
  alIniciar?: AxiosRequestConfig
}

interface Respuesta<T> extends Estado<T> {
  llamar: (props: AxiosRequestConfig, conAuth?: boolean) => void
}

interface Error {
  mensaje: string
  codigo: number
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
  cargando: false
}

const reducer = (estado: Estado, accion: Estado): Estado => ({
  ...estado,
  ...accion
})

export const llamarWS = async <T extends any>(
  config: AxiosRequestConfig,
  usuario?: any | null
) => {
  let respuesta: undefined | T
  let error: undefined | ErrorRespuesta

  try {
    let final = config
    if (usuario) {
      const headers = {
        Authorization: usuario.token
      }
      final = {
        ...final,
        headers: { ...config.headers, ...headers }
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
  const { alIniciar } = props || {}
  // const { enqueueSnackbar } = useSnackbar()
  const alIniciarRef = useRef(false)
  const llamando = useRef(false)
  const [state, dispatch] = useReducer(reducer, inicial)

  /* const { error } = state
  useEffect(() => {
    if (error) {
      if (error.error) {
        enqueueSnackbar(`${error.error.mensaje} (${error.error.codigo})`, {
          variant: 'error',
        })
      }
      if (error.errores) {
        error.errores!!.forEach((err) => {
          enqueueSnackbar(`${err.mensaje} (${err.codigo})`, { variant: 'error' })
        })
      }

      dispatch({ error: undefined })
    }
  }, [enqueueSnackbar, error]) */

  const llamar = useCallback(async (config: AxiosRequestConfig) => {
    if (!llamando.current) {
      llamando.current = true
      dispatch({ cargando: true, error: undefined, respuesta: undefined })
      const { error, respuesta } = await llamarWS(config)
      dispatch({ cargando: false, respuesta, error })
      llamando.current = false
    }
  }, [])

  useEffect(() => {
    if (!alIniciarRef.current && alIniciar) {
      llamar(alIniciar)
      alIniciarRef.current = true
    }
  }, [alIniciar, llamar])

  return { llamar, ...state }
}
