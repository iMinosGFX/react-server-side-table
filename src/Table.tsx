import React, {useContext, useEffect, useRef, useState, forwardRef, useImperativeHandle} from 'react'
import { useExpanded } from 'react-table';
import { useTable, useRowSelect } from 'react-table'
import _ from "lodash"
import { FilterItem } from './FiltersInteract'
import { filtersType, Sorter } from './ServerSideTable';
import { Translations } from './types/props'
import ItemFilter from './ItemFilter'
import FiltersContext from "./context/filterscontext"

type Props = {
  columns: any
  data: any
  renderRowSubComponent: any
  filters?: FilterItem[]
  hiddenColumns: string[]
  clickableHeader(e: any): void
  filterParsedType: filtersType
  translationsProps?: Translations
  selectableRows?: boolean
  showVerticalBorders?: boolean
  asyncLoading?: boolean
  setHaveSelectedRows?: (e: boolean) => void
  // onFiltersChange(filters: any): void
}

const IndeterminateCheckbox = React.forwardRef(
  // @ts-ignore
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef
    
    useEffect(() => {
      // @ts-ignore
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])
    
    return (
      <>
        {/* @ts-ignore */}
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

const selectedFlatRowsHistory = new Set();

export type TableHandler = {
  getSelectedRows: () => any[]
}

// const Table = ({ columns, data, renderRowSubComponent, filters, onFiltersChange}: Props) => {
const Table = forwardRef<TableHandler, Props>((props, ref) => {


  const { 
    columns, data, 
    renderRowSubComponent, hiddenColumns, 
    filters, filterParsedType, 
    translationsProps, selectableRows,
    asyncLoading
  } = props

  const [openedFilter, setOpenedFilter] = useState<string>(null)
  const node = useRef()
  const SstState = useContext(FiltersContext)

  function toggleSorterValue(columnId: string, sorter: Sorter){
    let _newValue = "";
    // @ts-ignore
    let _oldObject = Object.assign({}, SstState.sorterState);
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
    _oldObject[columnId] = {
      attribut: sorter.attribut,
      value: _newValue
    }
    SstState.changeSort(_oldObject)
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
          // Let's make a column for selection
          {
            id: 'selection',
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
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

                const filter = filters.filter(f => f.idAccessor === column.id)[0]
                
                return(
                  <th {...column.getHeaderProps()} className="SST_header_cell" key={j}>
                    <div className="SST_header_container noselect">
                      <span 
                        className="SST_header_title" 
                        {...column.getHeaderProps()}
                        onClick={() => {
                          if(!!SstState.sorterState[column.id]){
                            toggleSorterValue(column.id, SstState.sorterState[column.id])
                            //Triger change sorterState ASC / DESC / UNDEFINED
                            //
                          }
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
                      {!!filter && 
                        <i 
                        onClick={() => setOpenedFilter(openedFilter === column.id ? null : column.id)} 
                        className={`ri-filter-line fitler_icon ${filter.idAccessor === openedFilter ? "SST_filter_active" : ""}`} />}
                    </div>
                    {!!filter && filter.idAccessor === openedFilter &&
                      <div className="SST_header_filter_modal">
                        <ItemFilter 
                          key={filters.filter(f => f.idAccessor === column.id)[0]?.name} 
                          filter={filters.filter(f => f.idAccessor === column.id)[0] ?? null} 
                          filterParsedType={filterParsedType}
                          translationsProps={translationsProps}
                          darkMode={false}/>
                      </div>
                    }
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        {asyncLoading ? 
          <p>Chargement...</p>
          : 
          <tbody {...getTableBodyProps()} className={props.showVerticalBorders ? "" : "no-border"}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <React.Fragment key={row.getRowProps().key}>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell,k) => {
                    return <td {...cell.getCellProps()} key={k}>{cell.render('Cell')}</td>
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