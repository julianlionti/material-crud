import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Types, Crud } from 'material-crud'
import { FaArrowLeft } from 'react-icons/fa'
import { Button } from '@material-ui/core'

interface Camiseta {
  jugador: string
  numero: number
  equipo: string
}

const ItemCamiseta = ({ jugador, numero, equipo }: Camiseta) => {
  return (
    <div style={{ flex: 1 }}>
      <div>
        <span>Equipo: {equipo}</span>
      </div>
    </div>
  )
}

export default () => {
  const history = useHistory()

  useEffect(() => {
    return () => {}
  }, [])

  return (
    <Crud
      Left={
        <Button color="inherit" onClick={() => history.push('/')}>
          <FaArrowLeft />
        </Button>
      }
      fields={[
        { id: 'equipo', type: Types.Input, title: 'Equipo' },
        [
          { id: 'jugador', type: Types.Input, title: 'Jugador', grow: 6 },
          { id: 'numero', type: Types.Number, title: 'Numero', grow: 4 },
        ],
      ]}
      gender="F"
      description="Crud example"
      name="Camisetas"
      url="http://localhost:5050/api/camiseta"
      renderItem={(props: Camiseta) => {
        return <ItemCamiseta {...props} />
      }}
      onError={(err) => console.log(err)}
    />
  )
}
