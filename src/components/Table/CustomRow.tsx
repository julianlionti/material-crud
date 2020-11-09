import React, { memo, useCallback, useMemo } from 'react'
import { Checkbox, IconButton, makeStyles, TableRow, Tooltip } from '@material-ui/core'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { ListChildComponentProps } from 'react-window'
import AriaLabels from '../../utils/AriaLabels'
import { useLang } from '../../utils/CrudContext'
import { useABM } from '../../utils/DataContext'
import { FieldProps, StepProps } from '../Form/FormTypes'
import CustomCell from './CustomCell'
import CustomHeader, { SortProps } from './CustomHeader'
import { TableTypes } from './TableTypes'

interface Props extends Partial<ListChildComponentProps> {
  rowHeight: number
  customClassName?: string
  onSelect: (rowData: any) => void | null
  selected?: boolean
  onSort?: (sort: SortProps) => void
  onExpanded?: (index: number) => void
  onEdit?: false | ((rowData: any) => void)
  onDelete?: false | ((rowData: any) => void)
  showSelecting?: boolean
  isHeader?: boolean
  fields?: FieldProps[]
  steps?: StepProps[]
  index: number
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
    showSelecting,
    isHeader,
    fields,
    steps,
  } = props

  const lang = useLang()
  const { list, insertIndex, removeIndex, itemId, columns, extraActions } = useABM()
  const rowData = useMemo(() => list[index], [list, index])
  const classes = useClasses({ index, height: rowHeight, isChild: rowData.child })

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
    if (!onEdit && !onDelete && (!extraActions || (extraActions && extraActions.length === 0)))
      return null

    if (!fields && !steps) return null

    if (isHeader) return <CustomHeader col={{ width: 2, title: lang.crudCol, align: 'flex-end' }} />

    return (
      <CustomCell col={{ width: 2, align: 'flex-end' }} rowHeight={rowHeight} rowIndex={index}>
        {extraActions}
        {onEdit && (
          <Tooltip title={lang.edit}>
            <IconButton size="small" onClick={() => onEdit(rowData)}>
              <FaEdit />
            </IconButton>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title={lang.delete}>
            <IconButton size="small" onClick={() => onDelete(rowData)}>
              <FaTrash />
            </IconButton>
          </Tooltip>
        )}
      </CustomCell>
    )
  }, [isHeader, rowHeight, lang, index, onEdit, onDelete, rowData, fields, extraActions, steps])

  return (
    <TableRow
      aria-label={isHeader ? AriaLabels.RowHeader : AriaLabels.RowContent}
      component="div"
      className={`${classes.row} ${(isHeader && customClassName) || ''}`}
      style={style}>
      {renderSelecting()}
      {renderContent()}
      {renderCrud()}
    </TableRow>
  )
})

const useClasses = makeStyles((theme) => ({
  row: ({ index, isChild }: any) => ({
    display: 'flex',
    alignItems: isChild ? 'center' : undefined,
    backgroundColor:
      index % 2 !== 0 ? undefined : theme.palette.grey[theme.palette.type === 'dark' ? 600 : 200],
  }),
}))
