import React from 'react'

export interface Props {
  nombre: string
}

export default (props: Props) => {
  return <span>{props.nombre}</span>
}
