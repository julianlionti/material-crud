import React, {useRef, useEffect, useState} from 'react'
import Formulario, {Tipos, ComunesProps} from '.'
import BaseInput from './BaseInput'
import GoogleMapReact from 'google-map-react'
import Constantes from '../../util/Constantes'
import Marcador from '../Marcador'
import {useField} from 'formik'
import Alert from '@material-ui/lab/Alert'
import EstiloMapa from '../../util/EstiloMapa'
import {
  makeStyles,
  Backdrop,
  Typography,
  CircularProgress,
  Collapse,
} from '@material-ui/core'
import useAxios from '../../util/useAxios'

export interface AlUbicacionProps extends ComunesProps {
  tipo: Tipos.Ubicacion
  ayuda?: string
}

interface Posicion {
  lat?: number | ''
  lng?: number | ''
  localidad?: string
  provincia?: string
}

export default (props: AlUbicacionProps) => {
  const validarRef = useRef(false)
  const {id, grow, titulo, ayuda} = props
  const [mostrarAyuda, setMostrarAyuda] = useState(true)
  const [{value}, {error}, {setValue}] = useField<Posicion>(id)
  const {llamar, respuesta, cargando} = useAxios<any>()

  const clases = useClases()

  const {items} = respuesta || {}
  const [direccion] = items || []
  useEffect(() => {
    if (direccion && validarRef.current) {
      const {
        address: {state, city, countryCode},
      } = direccion
      if (countryCode === 'ARG') setValue({...value, provincia: state, localidad: city})
      else {
        setValue({provincia: '', localidad: '', lng: '', lat: ''})
      }
      validarRef.current = false
    }
  }, [direccion, setValue, value])

  return (
    <BaseInput grow={grow}>
      {ayuda && (
        <Collapse in={mostrarAyuda}>
          <Alert onClose={() => setMostrarAyuda(false)} severity="info">
            {ayuda}
          </Alert>
        </Collapse>
      )}
      <Typography className={clases.titulo}>{titulo}</Typography>
      <div className={clases.contenedor}>
        <div className={clases.inputs}>
          <Formulario
            iniciales={value}
            campos={[
              {
                id: 'provincia',
                tipo: Tipos.Input,
                titulo: 'Provincia',
                soloLectura: true,
                fullWidth: false,
              },
              {
                id: 'localidad',
                tipo: Tipos.Input,
                titulo: 'Localidad',
                soloLectura: true,
                fullWidth: false,
              },
              [
                {
                  id: 'lat',
                  tipo: Tipos.Input,
                  titulo: 'Latitud',
                  soloLectura: true,
                },
                {
                  id: 'lng',
                  tipo: Tipos.Input,
                  titulo: 'Longitud',
                  soloLectura: true,
                },
              ],
            ]}></Formulario>
        </div>
        <div className={clases.mapa}>
          <GoogleMapReact
            options={{disableDoubleClickZoom: true, styles: EstiloMapa}}
            bootstrapURLKeys={{key: Constantes.GoogleKey, region: 'AR', language: 'es'}}
            defaultCenter={{lat: -35.4135636, lng: -60.4992118}}
            defaultZoom={8}
            onClick={async ({lat, lng}) => {
              validarRef.current = true
              llamar({
                url: 'https://revgeocode.search.hereapi.com/v1/revgeocode',
                params: {
                  at: `${lat},${lng}`,
                  lang: 'es-AR',
                  apiKey: Constantes.HereKey,
                },
              })
              setValue({provincia: '', localidad: '', lat, lng})
            }}>
            {value?.lat && value?.lng && <Marcador lat={value.lat!!} lng={value.lng!!} />}
          </GoogleMapReact>
          <Backdrop className={clases.backdrop} open={cargando!!}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </div>
      {error && <Alert severity="error">{error}</Alert>}
    </BaseInput>
  )
}

const useClases = makeStyles((tema) => ({
  contenedor: {
    display: 'flex',
  },
  inputs: {
    marginLeft: -tema.spacing(1),
    flex: 1,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mapa: {
    height: 400,
    flex: 1,
    flexGrow: 2,
  },
  backdrop: {
    zIndex: tema.zIndex.drawer + 1,
    color: '#fff',
  },
  titulo: {
    marginTop: tema.spacing(1),
    marginBottom: tema.spacing(1),
  },
}))
