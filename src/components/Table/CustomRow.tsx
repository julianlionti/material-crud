import React, { memo, ReactNode, useCallback, useMemo } from 'react'
import { Checkbox, IconButton, makeStyles, TableRow, Tooltip, Typography } from '@material-ui/core'
import { AiOutlinePushpin, AiFillPushpin } from 'react-icons/ai'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'
import { ListChildComponentProps } from 'react-window'
import { compareKeysOmit } from '../../utils/addOns'
import AriaLabels from '../../utils/AriaLabels'
import { useLang } from '../../utils/CrudContext'
import { useABM } from '../../utils/DataContext'
import { FieldProps, StepProps } from '../Form/FormTypes'
import CustomCell from './CustomCell'
import CustomHeader, { SortProps } from './CustomHeader'
import { ColumnsProps, TableTypes } from './TableTypes'

interface Props extends Partial<ListChildComponentProps> {
  rowHeight: number
  customClassName?: string
  onSelect: (rowData: any) => void | null
  selected?: boolean
  onSort?: (sort: SortProps) => void
  onExpanded?: (index: number) => void
  onEdit?: false | ((rowData: any) => void)
  onDelete?: false | ((rowData: any) => void)
  onPinToTop?: false | ((row: any, exists: boolean) => void)
  onDetail?: (row: any) => void
  onClickRow?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowData: any,
    index: number,
  ) => void
  showSelecting?: boolean
  isHeader?: boolean
  fields?: FieldProps[]
  steps?: StepProps[]
  index: number
  columns: ColumnsProps[]
  extraActions?: (rowdata: any) => ReactNode[]
  actionsColWidth?: number
}

export default memo((props: Props) => {
  const {
    index,
    style,
    customClassName,
    onSort,
    onSelect,
    selected,
    rowHeight,
    onExpanded,
    onEdit,
    onDelete,
    onPinToTop,
    onDetail,
    onClickRow,
    showSelecting,
    isHeader,
    fields,
    steps,
    columns,
    extraActions,
    actionsColWidth,
  } = props

  const { list, insertIndex, removeIndex, itemId, pins, removePins } = useABM()
  const lang = useLang()
  const rowData = useMemo(() => list[index], [list, index])
  const classes = useClasses({ index, height: rowHeight, isChild: rowData?.child, onClickRow })

  const renderContent = useCallback(() => {
    if (isHeader) {
      return columns.map((col) => <CustomHeader onSort={onSort} key={col.id} col={col} />)
    }

    if (rowData.child) {
      return (
        <CustomCell rowIndex={index} rowHeight={rowData.height} isChild>
          {rowData.child(list[index - 1])}
        </CustomCell>
      )
    }

    const nextIsChild = !!list[index + 1]?.child
    return columns.map((col) => (
      <CustomCell
        expanded={nextIsChild}
        onExpand={() => {
          if (onExpanded) onExpanded(index)
          if (nextIsChild) return removeIndex(index + 1)

          switch (col.type) {
            case TableTypes.Custom:
              insertIndex(index + 1, {
                [itemId]: col.id + 'child',
                child: col.content,
                height: col.height,
              })
              break
            default:
              insertIndex(index + 1, {
                [itemId]: col.id + 'child',
                child: () => (
                  <Typography variant="body2">
                    Para usar content el atributo 'type' debe ser CUSTOM
                  </Typography>
                ),
                height: 48,
              })
          }
        }}
        rowIndex={index}
        rowHeight={rowHeight}
        key={col.id}
        col={col}
      />
    ))
  }, [
    removeIndex,
    isHeader,
    onSort,
    columns,
    rowHeight,
    index,
    insertIndex,
    itemId,
    list,
    onExpanded,
    rowData,
  ])

  const renderSelecting = useCallback(() => {
    if (!showSelecting || rowData?.child) return null

    if (isHeader)
      return (
        <CustomHeader col={{ width: 0.5 }}>
          <Checkbox
            checked={selected === true}
            indeterminate={selected === undefined}
            onChange={() => onSelect(rowData)}
          />
        </CustomHeader>
      )

    return (
      <CustomCell col={{ width: 0.5 }} rowIndex={index} rowHeight={rowHeight}>
        <Checkbox checked={selected} onChange={() => onSelect(rowData)} />
      </CustomCell>
    )
  }, [showSelecting, onSelect, index, rowHeight, isHeader, rowData, selected])

  const renderCrud = useCallback(() => {
    if (rowData?.child) return null
    if (
      !onEdit &&
      !onDelete &&
      !onDetail &&
      !onPinToTop &&
      (!extraActions || (extraActions && extraActions.length === 0))
    )
      return null

    if (
      !fields &&
      !steps &&
      !onDetail &&
      !onDelete &&
      !onPinToTop &&
      (!extraActions || (extraActions && extraActions.length === 0))
    )
      return null

    const width = actionsColWidth || 1

    if (isHeader) return <CustomHeader col={{ width, title: lang.crudCol, align: 'flex-end' }} />
    const alreadyPined = !!pins?.find((e) => e[itemId] === rowData[itemId])

    return (
      <CustomCell
        col={{ width, align: 'flex-end' }}
        horizontal
        rowHeight={rowHeight}
        rowIndex={index}>
        {extraActions && extraActions(rowData)}
        {onPinToTop && (
          <Tooltip title={lang.pinToTop} aria-label={AriaLabels.Actions.PinTopButton}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onPinToTop(rowData, alreadyPined)
              }}>
              {alreadyPined ? <AiFillPushpin /> : <AiOutlinePushpin />}
            </IconButton>
          </Tooltip>
        )}
        {onDetail && (
          <Tooltip title={lang.seeDetail} aria-label={AriaLabels.Actions.DetailButton}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onDetail(rowData)
              }}>
              <FaEye />
            </IconButton>
          </Tooltip>
        )}
        {onEdit && (fields || steps) && (
          <Tooltip title={lang.edit} aria-label={AriaLabels.Actions.EditButton}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(rowData)
              }}>
              <FaEdit />
            </IconButton>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title={lang.delete} aria-label={AriaLabels.Actions.DelButton}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                const pin = pins.find((p) => p[itemId] === rowData[itemId])
                if (pin) removePins(pin[itemId])

                onDelete(rowData)
              }}>
              <FaTrash />
            </IconButton>
          </Tooltip>
        )}
      </CustomCell>
    )
  }, [
    isHeader,
    rowHeight,
    lang,
    index,
    onEdit,
    onDelete,
    onPinToTop,
    rowData,
    fields,
    extraActions,
    steps,
    onDetail,
    actionsColWidth,
    itemId,
    pins,
    removePins,
  ])

  return (
    <TableRow
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        onClickRow && onClickRow(event, rowData, index)
      }
      aria-label={isHeader ? AriaLabels.RowHeader : AriaLabels.RowContent}
      component="div"
      className={`${classes.row} ${(isHeader && customClassName) || ''}`}
      style={style}>
      {renderSelecting()}
      {renderContent()}
      {renderCrud()}
    </TableRow>
  )
}, compareKeysOmit(['onDelete', 'onEdit', 'onExpanded', 'onSelect', 'onSort', 'onDetail', 'onClickRow']))

const useClasses = makeStyles((theme) => ({
  row: ({ index, isChild, onClickRow }: any) => ({
    display: 'flex',
    alignItems: isChild ? 'center' : undefined,
    backgroundColor:
      index % 2 !== 0 ? undefined : theme.palette.grey[theme.palette.type === 'dark' ? 600 : 200],
    cursor: onClickRow ? 'pointer' : undefined,
  }),
}))
