import React, { ReactNode, memo } from 'react'
import {
  Card,
  makeStyles,
  Typography,
  LinearProgress,
  Divider,
  Button,
  ButtonProps,
  IconButton,
} from '@material-ui/core'
import { FaTimes } from 'react-icons/fa'

export interface Props {
  children: ReactNode
  title?: string
  subtitle?: string
  footer?: string
  loading?: boolean
  noElevation?: boolean
  noPadding?: boolean
  button?: {
    title: string
    onClick: () => void
    show?: boolean
    props?: ButtonProps
  }
  Right?: ReactNode
  onClose?: () => void
  titleSize?: number
  subtitleSize?: number
  width?: number | string
}

export default memo((props: Props) => {
  const {
    children,
    title,
    subtitle,
    loading,
    button,
    noElevation,
    Right,
    footer,
    onClose,
    titleSize,
    subtitleSize,
    noPadding,
    width,
  } = props
  const clases = useClases({ titleSize, subtitleSize, noPadding, width })

  return (
    <div className={clases.contenedor}>
      <Card elevation={noElevation ? 0 : undefined} className={clases.card}>
        {loading && <LinearProgress />}
        <div className={clases.textos}>
          <div style={{ flex: 1 }}>
            {title && (
              <Typography variant="h1" className={clases.titulo} gutterBottom>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="h2"
                className={clases.subtitulo}
                color="textSecondary"
                gutterBottom>
                {subtitle}
              </Typography>
            )}
          </div>
          {onClose && (
            <div>
              <IconButton onClick={onClose}>
                <FaTimes />
              </IconButton>
            </div>
          )}
          {Right && <div>{Right}</div>}
        </div>
        {(title || subtitle) && <Divider className={clases.separador} />}
        <div className={clases.contenido}>{children}</div>
        {button?.show && (
          <div className={clases.btnContenedor}>
            <Button
              onClick={button.onClick}
              className={clases.boton}
              variant="outlined"
              color="primary"
              {...button.props}>
              {button.title}
            </Button>
          </div>
        )}
        {footer && <Divider className={clases.separador} />}
        {footer && (
          <div className={clases.pieContenedor}>
            <Typography
              variant="h2"
              className={clases.subtitulo}
              color="textSecondary"
              gutterBottom>
              {footer}
            </Typography>
          </div>
        )}
      </Card>
    </div>
  )
})

const useClases = makeStyles((tema) => ({
  contenedor: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenido: ({ noPadding }: any) => ({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: tema.spacing(noPadding ? 0 : 2),
  }),
  card: ({ width }: any) => ({
    [tema.breakpoints.up('sm')]: {
      width: width || '70%',
    },
    width: '90%',
  }),
  textos: {
    display: 'flex',
    flex: 1,
    padding: tema.spacing(2),
  },
  titulo: ({ titleSize }: any) => ({
    fontSize: titleSize || 26,
  }),
  subtitulo: ({ subtitleSize }: any) => ({
    fontSize: subtitleSize || 18,
  }),
  separador: {
    marginTop: tema.spacing(1),
    marginBottom: tema.spacing(1.5),
  },
  btnContenedor: {
    marginTop: tema.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  boton: {
    alignSelf: 'center',
    paddingLeft: tema.spacing(4),
    paddingRight: tema.spacing(4),
    marginTop: tema.spacing(2),
    marginBottom: tema.spacing(2),
  },
  pieContenedor: {
    padding: tema.spacing(2),
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
  },
}))
