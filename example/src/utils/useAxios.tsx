import { useAxios, UseAxiosProps } from 'material-crud'
import { CallProps, Error, ErrorResponse } from 'material-crud/dist/utils/useAxios'

type ResponseProps<T> = [
  T | undefined,
  boolean,
  CallProps,
  () => void,
  number | undefined,
  ErrorResponse | undefined,
]

export default <T extends any>(props?: UseAxiosProps): ResponseProps<T> => {
  const { call, response, loading, status, error, clean } = useAxios<T>(props)
  return [response, !!loading, call, clean, status, error]
}
