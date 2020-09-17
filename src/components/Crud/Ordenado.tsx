import React, { Fragment, useState, useCallback } from 'react'
import { Menu, MenuItem, ListItemIcon, Typography, Button } from '@material-ui/core'
import {
  FaSortAmountDownAlt,
  FaSortAlphaUp,
  FaSortAlphaDown,
  FaSortNumericDown,
  FaSortNumericUpAlt,
} from 'react-icons/fa'
import { TodosProps } from '../Form'
import { Types } from '../Form/Types'

export interface Ordenado {
  [key: string]: 1 | -1 | 0
}

interface Props {
  que: string
  columnas: TodosProps[]
  onOrden: (orden: Ordenado) => void
}

const icono = 22
export default (props: Props) => {
  const { columnas, onOrden } = props
  const [anchorOrdenar, setAnchorOrdenar] = useState<HTMLElement | null>(null)
  const [ordenado, setOrdenado] = useState<Ordenado>({})

  const renderIcono = useCallback(
    ({ id, type }: TodosProps) => {
      if (!ordenado) return <FaSortAmountDownAlt fontSize={icono} />
      switch (ordenado[id]) {
        case 1:
          if (type === Types.Numerico) return <FaSortNumericDown fontSize={icono} />
          return <FaSortAlphaDown fontSize={icono} />
        case -1:
          if (type === Types.Numerico) return <FaSortNumericUpAlt fontSize={icono} />
          return <FaSortAlphaUp fontSize={icono} />
        default:
          return <FaSortAmountDownAlt fontSize={icono} />
      }
    },
    [ordenado],
  )

  if (columnas.length === 0) return null

  return (
    <Fragment>
      <Button
        color="primary"
        endIcon={<FaSortAmountDownAlt />}
        onClick={(e) => setAnchorOrdenar(e.currentTarget)}>
        Ordenar
      </Button>
      <Menu
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={anchorOrdenar}
        open={!!anchorOrdenar}
        onClose={() => setAnchorOrdenar(null)}>
        {columnas.map((e) => (
          <MenuItem
            key={e.id}
            onClick={() =>
              setOrdenado((orden) => {
                const final: Ordenado = {
                  ...orden,
                  [e.id]: orden[e.id] === undefined ? 1 : orden[e.id] === 1 ? -1 : 0,
                }
                Object.keys(final).forEach((el) => {
                  if (final[el] === 0) {
                    delete final[el]
                  }
                })
                onOrden(final)
                return final
              })
            }>
            <ListItemIcon>{renderIcono(e)}</ListItemIcon>
            <Typography variant="inherit" noWrap>
              {e.title}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  )
}
