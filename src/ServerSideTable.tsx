import React, {useState, useRef, useImperativeHandle, forwardRef, useLayoutEffect, ReactElement } from 'react'
import Table from './components/Table'
import ReactPaginate from 'react-paginate';
import { FiltersContainer, PerPageContainer, TableContainer, TableStyles } from './assets/styled-components';
import _ from 'lodash';
import SettingsInteractor from './components/SettingsInteractor';
import FiltersViewers from './components/FiltersViewers';
import { newParseFilterRSQL } from './newParserRSQL';
import FiltersContext from './context/filterscontext';
import {translations} from "./assets/translations"
import { isMobile } from 'react-device-detect';
import { TableHandler } from './components/Table';
import { GPaginationObject, LineSpacing, NewFilterItem } from './types/entities';
import { DataRequestParam, DefaultFiltersOptions, SorterRecord } from './types/entities';
import {  newCreateDefaultFilter } from './helpers/createDefaultFilters';
import { ExportType, SSTHandler, SSTProps } from './types/components-props';
import { destroyTableFiltersStorage,  getTableData,  registerTableFilters } from './helpers/SSTlocalStorageManagement';
import useDidMountEffect from './helpers/useDidMountEffect';

FiltersContext.displayName = "ServerSideTableContext";

const ServerSideTable = forwardRef<SSTHandler, SSTProps>((props, ref) => {

    const {
        translationsProps, 
        marginPagesDisplayed = 2, 
        pageRangeDisplayed = 2,
        columns = [],
        containerClassName,
        counterColumnToItemGoLeft,
        isFilter = true,
        isRenderSubComponent,
        selectableRows,
        selectedRowsAction,
        showAddBtn,
        smallTextsHeader,
        filtersContainerClassName,
        defaultProps,
        darkMode,
        renderSubComponent,
        mobileColumns,
        tableId,
        withoutHeader,
        withoutTotalElements,
        enabledExport,
        onDataChange,
        onAddClick,
        onRowClick,
        optionnalsHeaderContent,
        showVerticalBorders,
        newFiltersList,
        newDefaultFilters,
        asDefaultFilters = false
    } = props     

    const [newFilterState, setNewFilterState] = useState<NewFilterItem[]>(!!getTableData(tableId)?.filters?.length 
                                                                                ? newCreateDefaultFilter(getTableData(tableId).filters, newDefaultFilters, true) 
                                                                                : newCreateDefaultFilter(newFiltersList, newDefaultFilters))
                                                                                
    const [newAppliedFilterState, setNewAppliedFilterState] = useState<NewFilterItem[]>(!!getTableData(tableId)?.filters?.length 
                                                                                ? newCreateDefaultFilter(getTableData(tableId).filters, newDefaultFilters, true) 
                                                                                : newCreateDefaultFilter(newFiltersList, newDefaultFilters))

    // const [newAppliedFilterState, setNewAppliedFilterState] = useState<NewFilterItem[]>([])

                                                                    
    const [sorterState, setSorterState] = useState<SorterRecord>(defaultProps?.sort ? defaultProps.sort : null )

    const [submitSorter, setSubmitSorter] = useState<string[]>(defaultProps?.sort ? Object.values(defaultProps.sort)
                                                                                                    .filter(sorter => !!sorter.value)
                                                                                                    .map(sorter => sorter.attribut + ',' + sorter.value) : [])
    
    const [offset, setOffset] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(null)
    const tableRef = useRef<TableHandler>(null)
    const [data, setData] = useState<GPaginationObject<any>>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [haveSelectedRows, setHaveSelectedRows] = useState<boolean>(false)
    const [perPage, setPerPage] = useState<number>(getTableData(tableId)?.perPageItems ?? defaultProps?.perPageItems ?? 20);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>(getTableData(tableId)?.hideColumns ?? defaultProps?.hideColumns ?? [])
    const [lineSpacing, setLineSpacing] = useState<LineSpacing>(getTableData(tableId)?.lineSpacing ?? defaultProps?.lineSpacing ?? "medium")
    const [isShowVerticalBorders, setShowVerticalBorders] = useState<boolean>(getTableData(tableId)?.showVerticalBorders ?? defaultProps?.showVerticalBorders ?? false)
    const isInitialMount = useRef(true);

    useDidMountEffect(() => {
        setNewAppliedFilterState(!!getTableData(tableId)?.filters?.length 
        ? newCreateDefaultFilter(getTableData(tableId).filters, newDefaultFilters, true) 
        : newCreateDefaultFilter(newFiltersList, newDefaultFilters))
    }, [newDefaultFilters])

    const updateDataOnChange = (requestParam: DataRequestParam, caller: string) => {
        setLoading(true)
        onDataChange(requestParam)
            .then(data => {
                if(!!data && !!data?.content){
                    setData(data)
                    setLoading(false)
                    setTotalElements(data?.totalElements ?? null)
                }
            })
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage)
    };
    
	useLayoutEffect(() => {
        if(isInitialMount.current)
            isInitialMount.current = false
        else {
            updateDataOnChange({offset,perPage, query: newParseFilterRSQL(newAppliedFilterState), sorter: submitSorter}, 'offset & perpage')
        }
    }, [offset, perPage])

    useImperativeHandle(ref, () => ({
        reloadData() {
            updateDataOnChange({offset,perPage,query: newParseFilterRSQL(newAppliedFilterState), sorter: submitSorter}, 'reloadData')
        },
        getSelectedRows(): any[] {
            return tableRef.current.getSelectedRows()
        }
    }))

    useLayoutEffect(() => {
        updateDataOnChange({
            offset,
            perPage,
            sorter: submitSorter,
            query: newParseFilterRSQL(newAppliedFilterState)
        }, 'new applied')
    }, [newAppliedFilterState])

    const changeFilter = (name: string, id: number, content: {option:DefaultFiltersOptions, value:string}) => {
        let _filter = newFilterState.filter(f => f.id === id && f.name === name)[0]
        _filter = {..._filter, option: content.option, value:content.value}
        setNewFilterState(_.cloneDeep(newFilterState.map(f => (f.id === _filter.id && f.name === _filter.name ) ? _filter : f)))
    }

    const onClearFilter = (name: string, id: number, index?:number, clearRadio?:boolean) => {
        
        let _filtersForName =  [...newFilterState].filter(f => f.name === name),
            _filter = [..._filtersForName].filter(f => f.id === id)[0]
        
        if(_filtersForName.length === 1){ //If just one filter for this name, clear value
            _filter = {..._filter, value: clearRadio ? "NA" : null}
            setNewFilterState(_.cloneDeep([...newFilterState].map(f => (f.id === _filter.id && f.name === _filter.name ) ? _filter : f)))
            setNewAppliedFilterState(_.cloneDeep([...newFilterState].map(f => (f.id === _filter.id && f.name === _filter.name ) ? _filter : f)))
            !!tableId && registerTableFilters({filters: _.cloneDeep([...newFilterState].map(f => (f.id === _filter.id && f.name === _filter.name ) ? _filter : f))}, tableId)
        
        } else { //If more one than filter for this name, delete by index
            let _currentArray = [...newFilterState]
            _currentArray.splice(index, 1)
            setNewFilterState(_currentArray)
            setNewAppliedFilterState(_currentArray)
            !!tableId && registerTableFilters({filters: _currentArray}, tableId)
        }
        
    }

    const onClearAll = () => {
        let _initialFilters = newCreateDefaultFilter(newFiltersList, newDefaultFilters)
        setNewFilterState(_.cloneDeep(_initialFilters))
        setNewAppliedFilterState(_.cloneDeep(_initialFilters))
        registerTableFilters({filters: []}, tableId)
        // destroyTableFiltersStorage(tableId)
    }

    const onClickApply = () => {
        let _array = _.cloneDeep(newFilterState)
        setNewFilterState(_array)
        setNewAppliedFilterState(_array)
        !!tableId && registerTableFilters({filters: _array}, tableId)
    }

    const onSortChange = (e: SorterRecord) => {
        let _test = Object.values(e)
            .filter(sorter => !!sorter.value)
            .map(sorter => sorter.attribut + ',' + sorter.value)
        setSorterState(e)
        setSubmitSorter(_test)
        registerTableFilters({sort: e}, tableId)
        updateDataOnChange({offset, perPage,query: newParseFilterRSQL(newAppliedFilterState), sorter: _test}, 'onSortChange')

    }

    const onHeaderClick = (e: any) => {
        //DO SOMETHING ?
    };

    const onLineSpacingChange = (e: LineSpacing) => {
        setLineSpacing(e)
        registerTableFilters({lineSpacing: e}, tableId)
    }

    const onShowVerticalBorderChange = (e: boolean) => {
        setShowVerticalBorders(e)
        registerTableFilters({showVerticalBorders: e}, tableId)
    }

    function exportData(e: ExportType): Promise<any> {
        if(e === "one"){
            return onDataChange({offset,perPage,query: newParseFilterRSQL(newAppliedFilterState), sorter: submitSorter})
            .then(data => {
                if(!!data && !!data?.content){
                    return data
                } else {
                    return {content: []}
                }
            })
        } else {
            return onDataChange({offset: 0, perPage: 999,query: newParseFilterRSQL(newAppliedFilterState), sorter: submitSorter})
            .then(firstData => {
                if(firstData.totalElements > 999){
                    let _apiCalls = []
                    for(let i = 1; i < firstData.totalPages; i++) 
                        _apiCalls.push(onDataChange({offset: i, perPage: 999,query: newParseFilterRSQL(newAppliedFilterState), sorter: submitSorter}))
                    return Promise.all(_apiCalls)
                    .then(datas => {
                        let _concatArrays = firstData.content ?? []
                        datas.sort((a,b) => a.number - b.number).map(d => _concatArrays = _concatArrays.concat(d.content))
                        return {content: _concatArrays}
                    })
                } else {
                    return firstData
                }
            })
        }
    }

    function renderSelectedRowsActions(): ReactElement {
        return (
            <div className={`multi-button ${!!haveSelectedRows ? '' : 'disabled'}`}>
                {Object.values(selectedRowsAction).map((action) => (
                    <button className={`btn-sm ${!!action.color ? `btn-${action.color}` : ''}`} onClick={action.onClick}>
                        {!!action?.icon && <div className="btn__icon">{action.icon}</div>}
                        <div className="btn__text">{action.text}</div>
                    </button>
                ))}
            </div>
        )
    }

    function renderOptionsHeaderActions(): ReactElement{
        return (
            <div className='multi-button'>
                {Object.values(optionnalsHeaderContent).map((action) => (
                    <button className={`btn-sm ${!!action.color ? `btn-${action.color}` : ''}`} onClick={action.onClick}>
                        {!!action?.icon && <div className="btn__icon">{action.icon}</div>}
                        <div className="btn__text">{action.text}</div>
                    </button>
                ))}
            </div>
        )
    }

    function onAddFilter(filterName: string){
        let _currentLastFilter = newFilterState
                                .filter(f => f.name === filterName)
                                .sort((a,b) => a.id - b.id)
                                .slice(-1)[0]
        
        setNewFilterState([
            ..._.cloneDeep(newFilterState),
            {..._currentLastFilter, id: _currentLastFilter.id+1, value: null}
        ])
    }

    const syncNewStateFilters = (filters: NewFilterItem[]) => {
        setNewFilterState(filters)
    }

    return(
        <FiltersContext.Provider value={{
            filtersState: null,
            submitFiltersState: null,
            newFilterState: newFilterState,
            newSubmitFilterState: newAppliedFilterState,
            sorterState: sorterState,
            changeSort: onSortChange,
            changeFilter: changeFilter,
            onClearFilter: onClearFilter,
            onClearAll: onClearAll,
            onClickApply: onClickApply,
            onAddFilter: onAddFilter,
            syncNewStateFilters: syncNewStateFilters
            
        }}>
            <TableContainer darkMode={darkMode} className="SST_container">
                <TableStyles lineSpacing={lineSpacing} className={containerClassName} darkMode={darkMode}>
                    {!withoutHeader && 
                        <div className="SST_HEADER">
                            {isFilter && 
                                <FiltersContainer darkMode={darkMode} className={`${filtersContainerClassName ?? ""} SST_filters_container`}>
                                    <FiltersViewers translationsProps={translationsProps} darkMode={darkMode}/>
                                    {/* {isMobile && 
                                        <FiltersInteract 
                                            filters={filtersList} 
                                            onSubmit={e => handleFilterSubmit(e)} 
                                            filterParsedType={filterParsedType}
                                            translationsProps={translationsProps}
                                            darkMode={darkMode}
                                            isMobile={isMobile}/>
                                    } */}
                                </FiltersContainer>
                            }
                            <div className="actions-headers-container">
                                {selectableRows && selectedRowsAction &&
                                    <div className="SST_selected_rows_buttons">
                                        {renderSelectedRowsActions()}
                                    </div>
                                }
                                {optionnalsHeaderContent && renderOptionsHeaderActions()}
                                <div className="multi-button">
                                    {showAddBtn && 
                                        <button className="btn-primary" style={{margin: "0 10px"}}  onClick={() => onAddClick()}>
                                                <div className="btn__icon"><i className='ri-add-line'/></div>
                                                <div className="btn__text">{translationsProps?.add ?? translations.add}</div>
                                        </button>
                                    }
                                </div>
                                <div className="table-actions-container">
                                    <div className="icons">
                                        {!isMobile &&
                                            <SettingsInteractor 
                                                columns={columns}
                                                hiddenColumns={hiddenColumns}
                                                onHiddenColumnsChange={(e: string[]) => setHiddenColumns(e)}
                                                onLineSpacingChange={onLineSpacingChange}
                                                translationsProps={translationsProps}
                                                enabledExport={enabledExport}
                                                handleExport={exportData}
                                                darkMode={darkMode}
                                                tableId={tableId}
                                                lineSpacing={lineSpacing}
                                                showVerticalBorders={isShowVerticalBorders}
                                                onShowVerticalBorderChange={onShowVerticalBorderChange}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                        <>
                            <Table 
                                ref={tableRef}
                                data={!data ? [] : data.content} 
                                clickableHeader={onHeaderClick}
                                columns={isMobile && mobileColumns ? mobileColumns : columns} 
                                renderRowSubComponent={isRenderSubComponent ? renderSubComponent : ""}
                                hiddenColumns={hiddenColumns}
                                newFilters={newFilterState}
                                translationsProps={translationsProps}
                                selectableRows={selectableRows}
                                setHaveSelectedRows={setHaveSelectedRows}
                                showVerticalBorders={showVerticalBorders}
                                asyncLoading={loading}
                                smallTextsHeader={smallTextsHeader}
                                onRowClick={onRowClick}
                                counterColumnToItemGoLeft={counterColumnToItemGoLeft}/>
                        </>
                    <div className="footerTable">
                        <ReactPaginate
                            previousLabel={<i className="ri-arrow-left-s-line" style={{transform: "translateY(2px)"}}/>}
                            nextLabel={<i className="ri-arrow-right-s-line" style={{transform: "translateY(2px)"}}/>}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={data?.totalPages}
                            marginPagesDisplayed={marginPagesDisplayed}
                            pageRangeDisplayed={pageRangeDisplayed}
                            onPageChange={handlePageClick}
                            containerClassName={"paginationTable"}
                            subContainerClassName={"pages paginationTable"}
                            activeClassName={"active"} />
                        {!!totalElements && !withoutTotalElements && <span className='font-italic medium'>Total : {totalElements} élement{totalElements > 1 && "s"}</span>}
                        <PerPageContainer>
                            <label htmlFor="perPageSelect">{translationsProps?.linePerPage ?? translations.linePerPage}</label>
                            <select 
                                name="perPageSelect" 
                                value={perPage} 
                                onChange={(e) => {
                                    setPerPage(parseInt(e.target.value))
                                    registerTableFilters({perPageItems: parseInt(e.target.value)}, tableId)
                                }}
                                style={{background: "#fff", width: 30}}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </PerPageContainer>
                    </div>
                    <div style={{clear: "both"}}></div>
                </TableStyles>
            </TableContainer>
        </FiltersContext.Provider>
    )
})

export default ServerSideTable

