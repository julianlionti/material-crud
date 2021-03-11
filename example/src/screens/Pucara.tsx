import React, { useEffect, useState } from 'react'
import { createColumns, createFields, Crud, FormTypes, TableTypes, useAxios } from 'material-crud'
import { IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core'
import { useMemo } from 'react'
import { FaChevronCircleDown, FaChevronCircleUp, FaEye, FaSave } from 'react-icons/fa'
import * as Yup from 'yup'
import { FieldProps } from '../../../dist/components/Form/FormTypes'
import { createServer } from 'miragejs'
import fakePucara from '../util/fakePucara'

type RenderType = FormTypes.Input | FormTypes.Number | FormTypes.OnlyTitle | FormTypes.Secure

export const renderType = (type?: string): RenderType => {
  if (type === 'string') return FormTypes.Input
  else if (type === 'protected-string') return FormTypes.Secure
  else if (type === 'integer') return FormTypes.Number

  return FormTypes.OnlyTitle
}

export default () => {
  const classes = useClasses()
  const [border, setBorder] = useState(true)
  const { response: types } = useAxios<{ results: any[] }>({
    onInit: { url: '/api/types' },
  })

  useEffect(() => {
    createServer({
      routes() {
        this.get('/api/types', fakePucara.types)
        this.get('/api/c2', fakePucara.c2Response)
      },
    })
  })

  const columns = useMemo(
    () =>
      createColumns([
        {
          id: 'id',
          title: 'ID',
          type: TableTypes.String,
          width: 1,
          align: 'center',
        },
        {
          id: 'c2_type',
          title: 'C2 ID',
          type: TableTypes.String,
          width: 1,
          align: 'center',
        },
        {
          id: 'type',
          title: 'Type',
          type: TableTypes.String,
          cellComponent: ({ rowData }) =>
            types?.results.find((x) => x.id === rowData.c2_type)?.name || '-',
          width: 4,
          align: 'center',
        },
        {
          id: 'creation_date',
          title: 'Date',
          type: TableTypes.Date,
          width: 3,
        },
        {
          id: 'expand',
          title: 'Options',
          type: TableTypes.Custom,
          height: 70,
          width: 1,
          align: 'flex-end',
          cellComponent: ({ expandRow, isExpanded }) => {
            return (
              <IconButton size="small" onClick={expandRow}>
                {isExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
              </IconButton>
            )
          },
          content: (rowData) =>
            !rowData?.options.length
              ? 'Without options'
              : rowData?.options.map(({ name, value }: any) => (
                  <span key={name}>{`${name} (${value})`}</span>
                )),
        },
      ]),
    [types],
  )

  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'imagen',
          title: 'Imagen',
          type: FormTypes.Image,
          help: 'Ayudaaaaa',
        },
        {
          id: 'prueba',
          type: FormTypes.Input,
          title: 'PROBANDO',
          defaultValue: 'HOLAAA',
        },
        {
          id: 'c2_type',
          title: 'Type',
          type: FormTypes.Options,
          placeholder: 'Select one type',
          options: types?.results.map(({ id, name }: any) => ({ id, title: name })) || [],
          validate: Yup.number().required('Required'),
          readonly: 'edit',
          defaultValue: 1,
        },
        types?.results
          .reduce((final, { id, options }): FieldProps[] => {
            const item = options.map(
              ({ type, name, description, required, example }: any): FieldProps => ({
                id: `${id}-${name}`,
                type: renderType(type),
                title: name,
                help: description ? (
                  <React.Fragment>
                    <Typography color="inherit">{description}</Typography>
                    {<em>Example: {example}</em>}
                  </React.Fragment>
                ) : (
                  ''
                ),
                depends: (props) => id === props.c2_type,
                validate:
                  required?.toLowerCase() === 'true'
                    ? Yup.string().when('c2_type', {
                        is: (val) => val === id,
                        then: Yup.string().required('Required'),
                        otherwise: Yup.string().notRequired(),
                      })
                    : undefined,
              }),
            )
            return [...final, item]
          }, [])
          ?.flat(),
      ]),
    [types],
  )

  const filters = useMemo(
    () =>
      createFields([
        {
          id: 'created_since',
          type: FormTypes.Date,
          title: 'Created Since',
        },
        {
          id: 'created_until',
          type: FormTypes.Date,
          title: 'Created Until',
        },
      ]),
    [],
  )

  useEffect(() => {
    setTimeout(() => {
      setBorder((b) => !b)
    }, 2500)
  }, [])

  return (
    <Crud
      noBorder={border}
      showHelpIcon
      response={{
        list: (cList: any) => ({
          items: cList.results,
          page: cList.current,
          limit: 10,
          totalDocs: cList.count,
          totalPages: 2,
        }),
        new: (_: any, response: any) => response,
        edit: (_: any, response: any) => response,
      }}
      interaction={{ page: 'page', perPage: 'limit' }}
      idInUrl
      itemId="id"
      noFilterOptions
      transformFilter={(query) => {
        const keys = Object.keys(query)
        const finalFilter = keys.reduce((acc, it) => ({ ...acc, [it]: query[it].value }), {})
        return finalFilter
      }}
      description="C2 example"
      name="C2"
      actions={{ edit: true, delete: true, pinToTop: true }}
      url={'/api/c2'}
      filters={filters}
      columns={columns}
      rowStyle={(rowData, index) => {
        if (index === 0) return classes.filaVerde
        return ''
      }}
      fields={fields}
      extraActions={(rowData) => {
        return [
          <Tooltip title="Go to listeners" key={rowData.id}>
            <IconButton size="small" onClick={() => {}}>
              <FaEye />
            </IconButton>
          </Tooltip>,
        ]
      }}
      transform={(action, rowData) => {
        if (action === 'new' || action === 'update') {
          const options = Object.keys(rowData).reduce<any[]>((final, actual) => {
            if (rowData.c2_type.toString() !== actual.split('-')[0]) {
              return final
            }
            const item = { name: actual.split('-')[1], value: rowData[actual] }
            return [...final, item]
          }, [])
          return { ...rowData, options }
        }
        return rowData
      }}
      transformToEdit={(data) => {
        const options = data.options.reduce((final: {}, { name, value }: any) => {
          const item = { [`${data.c2_type}-${name}`]: value }
          return { ...final, ...item }
        }, {})
        return { ...data, ...options }
      }}
      // detailView={(rowData) => ({
      //   sections: [
      //     {
      //       title: 'Titulo primero',
      //       section: [
      //         [
      //           ['Primer dato', rowData.id],
      //           ['Segudno', 'Daleee'],
      //         ],
      //       ],
      //     },
      //   ],
      //   actions: [
      //     <Tooltip title="Descargar">
      //       <IconButton onClick={() => alert(JSON.stringify(rowData))}>
      //         <FaSave />
      //       </IconButton>
      //     </Tooltip>,
      //   ],
      // })}
    />
  )
}

const useClasses = makeStyles((theme) => ({
  filaVerde: {
    backgroundColor: 'green',
  },
}))
