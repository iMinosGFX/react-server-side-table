import React, {useContext, useEffect, useRef, useState, forwardRef, useImperativeHandle} from 'react'
import { useExpanded } from 'react-table';
import { useTable, useRowSelect } from 'react-table'
import _ from "lodash"
import ItemFilter from './ItemFilter'
import FiltersContext from "../context/filterscontext"
import { Sorter } from '../types/entities';
import { translations } from '../assets/translations';
import { TableProps } from '../types/components-props';
import {IndeterminateCheckbox} from "./IndeterminateCheckbox"

export type TableHandler = {
  getSelectedRows: () => any[]
}

// const Table = ({ columns, data, renderRowSubComponent, filters, onFiltersChange}: Props) => {
const Table = forwardRef<TableHandler, TableProps>((props, ref) => {

  const { 
    columns, 
    data, 
    renderRowSubComponent, 
    hiddenColumns, 
    newFilters,
    translationsProps, 
    selectableRows,
    smallTextsHeader, 
    asyncLoading, 
  } = props

  const [openedFilter, setOpenedFilter] = useState<string>(null)
  const node = useRef()
  const SstState = useContext(FiltersContext)

  function toggleSorterValue(columnId: string, sorter: Sorter){
    let _newValue = "";
    // @ts-ignore
    let _newSorterState = Object.assign({}, SstState.sorterState);
    switch(sorter.value){
      case "desc": 
      _newValue = "asc";
      break;
      case "asc": 
      _newValue = undefined;
      break;
      case undefined: 
      _newValue = "desc";
    }
    _newSorterState[columnId] = {
      attribut: sorter.attribut,
      value: _newValue
    }

    SstState.changeSort(_newSorterState)
  }
  
  useImperativeHandle(ref, () => ({
    getSelectedRows(): any[] {
        return selectedFlatRows
    }
  }))

  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      rows,
      visibleColumns,
      setHiddenColumns,
      selectedFlatRows,
      state: { selectedRowIds },
    } = useTable(
      {
        columns,
        data, 
        initialState: { 
          pageIndex: 0
        },
      },
      useExpanded,
      useRowSelect,
      hooks => {
        !!selectableRows && hooks.visibleColumns.push(columns => [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ])
      }
    )

    useEffect(() => {
      setHiddenColumns(hiddenColumns)
    }, [hiddenColumns])

    useEffect(() => {
      if(!!selectedFlatRows && selectedFlatRows.length > 0){
        props.setHaveSelectedRows(true)
      } else {
        props.setHaveSelectedRows(false)
      }
    }, [selectedFlatRows])

    /**
     * useRef pour remove sidebar info au clic exterieur
     */
      const handleClick = e => {
          //@ts-ignore
          if (node.current && node.current.contains(e.target)) {
              return;
          } else {
              setOpenedFilter(null)
          }
      };
      
      useEffect(() => {
          document.addEventListener("mousedown", handleClick);
          return () => document.removeEventListener("mousedown", handleClick);
      }, []);

    return(
    <>
      <table {...getTableProps()} className="table no-border">
        <thead className={props.showVerticalBorders ? "" : "no-border"}>
          {headerGroups.map((headerGroup,i) => (
            <tr {...headerGroup.getHeaderGroupProps()} ref={node} key={i}>
              {headerGroup.headers.map((column,j) => {
                const filterName = SstState?.newFilterState?.filter(f => f.idAccessor === column.id)?.[0]?.name ?? null,
                      filterAccessor = SstState?.newFilterState?.filter(f => f.idAccessor === column.id)?.[0]?.idAccessor ?? null,
                      filterType = SstState?.newFilterState?.filter(f => f.idAccessor === column.id)?.[0]?.type ?? null
                return( 
                  <th {...column.getHeaderProps()} className="SST_header_cell" key={j}>
                    <div className="SST_header_container noselect" style={{justifyContent: !!column.alignment ? column.alignment : "left"}}>
                      <span 
                        className={`SST_header_title ${!!SstState.sorterState?.[column.id] ? "pointer" : ""} ${smallTextsHeader ? "SST_header_title_small" : ""}`}
                        {...column.getHeaderProps()}
                        onClick={() => {
                          if(!!SstState.sorterState[column.id])
                            toggleSorterValue(column.id, SstState.sorterState?.[column.id])
                        }}>
                        {column.render('Header')}
                      </span>
                      <span>
                        {!!column.id && !!SstState.sorterState?.[column.id] && !!SstState.sorterState?.[column.id]["value"]
                          ? SstState.sorterState?.[column.id]["value"] === "desc"
                          ? <i className="ri-arrow-down-s-fill sorter_icon" />
                          : <i className="ri-arrow-up-s-fill sorter_icon" />
                          : ''}
                      </span>
                      {!!filterName && 
                        <i 
                        onClick={() => setOpenedFilter(openedFilter === column.id ? null : column.id)} 
                        className={`ri-filter-line fitler_icon ${filterAccessor === openedFilter ? "SST_filter_active" : ""}`} />}
                    </div>
                    {!!filterAccessor?.[0] && filterAccessor === openedFilter &&
                      <div className="SST_header_filter_modal">
                        <ItemFilter 
                          key={i} 
                          filterName={filterName}
                          filterType={filterType}
                          translationsProps={translationsProps}
                          darkMode={false}
                          onClose={() => setOpenedFilter(null)}/>
                      </div>
                    }
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        {asyncLoading ? 
          <tbody style={{textAlign: "center", display: 'flex', alignItems: "center"}}>
            <tr>
              <td>
                {translationsProps?.loading ?? translations.loading} <i className="ri-loader-4-fill spinner rotate"/>
              </td>
            </tr>
          </tbody>
          : 
          <tbody {...getTableBodyProps()} className={props.showVerticalBorders ? "" : "no-border"}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <React.Fragment key={row.getRowProps().key}>
                <tr {...row.getRowProps()}  onClick={() => !!props.onRowClick && props.onRowClick(row.original)} className={!!props.onRowClick ? "pointer" : ""}>
                  {row.cells.map((cell,k) => {
                    return <td {...cell.getCellProps()} key={k} style={{textAlign: cell.column.alignment}}>{cell.render('Cell')}</td>
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
        }
      </table>
    </>
    )
})

export default Table