import React, {useEffect, useState} from 'react'
import {useExpanded} from 'react-table'
import { useTable } from 'react-table'
import _ from "lodash"

type Props = {
  columns: any
  data: any
  renderRowSubComponent: any
  filters?: {
    name:string
    label:string
    filterType: string
    headerId?:string
  }[]
  hiddenColumns: string[]
}

const Table = ({ columns, data, renderRowSubComponent, hiddenColumns}: Props) => {

  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      rows,
      visibleColumns,
      setHiddenColumns
    } = useTable(
      {
        columns,
        data, 
        initialState: { 
          pageIndex: 0
        },
      },
      useExpanded,
    )

    useEffect(() => {
      setHiddenColumns(hiddenColumns)
    }, [hiddenColumns])
    
    return(
      <>
      <table {...getTableProps()} className="table no-border">
      <thead className="no-border">
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              return(
                <th {...column.getHeaderProps()}>
                  <span>{column.render('Header')}</span>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
        <tbody {...getTableBodyProps()} className="no-border">
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <React.Fragment key={row.getRowProps().key}>
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
              {row.isExpanded ? (
                <tr style={{background: '#F1EFFE'}}>
                  <td colSpan={visibleColumns.length}>
                    {renderRowSubComponent({ row })}
                  </td>
                </tr>
              ) : null}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </>
    )
}

export default Table