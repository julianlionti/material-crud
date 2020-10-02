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
import { Translations } from '../../translate'
import { useLang } from '../../utils/CrudContext'

export interface SortProps {
  [key: string]: 1 | -1 | 0
}

interface Props {
  que: string
  columnas: TodosProps[]
  onOrden: (orden: SortProps) => void
}

const icono = 22
export default (props: Props) => {
  const { columnas, onOrden } = props
  const lang = useLang()
  const [anchorOrdenar, setAnchorOrdenar] = useState<HTMLElement | null>(null)
  const [ordenado, setOrdenado] = useState<SortProps>({})

  const renderIcono = useCallback(
    ({ id, type }: TodosProps) => {
      if (!ordenado) return <FaSortAmountDownAlt fontSize={icono} />
      switch (ordenado[id]) {
        case 1:
          if (type === Types.Number) return <FaSortNumericDown fontSize={icono} />
          return <FaSortAlphaDown fontSize={icono} />
        case -1:
          if (type === Types.Number) return <FaSortNumericUpAlt fontSize={icono} />
          return <FaSortAlphaUp fontSize={icono} />
        default:
          return <FaSortAmountDownAlt fontSize={icono} />
      }
    },
    [ordenado],
  )

  if (!columnas.length) return null

  return (
    <Fragment>
      <Button
        color="primary"
        endIcon={<FaSortAmountDownAlt />}
        onClick={(e) => setAnchorOrdenar(e.currentTarget)}>
        {lang?.sort || 'Ordenar'}
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
                const final: SortProps = {
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
