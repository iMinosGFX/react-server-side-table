import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import Table from './Table'
import ReactPaginate from 'react-paginate';
import { FiltersContainer, PerPageContainer, TableContainer, TableStyles } from './assets/styled-components';
import _ from 'lodash';
import FiltersInteract from './FiltersInteract';
import SettingsInteractor from './SettingsInteractor';
import FiltersViewers from './FiltersViewers';
import { parseFilterRSQL } from './parserRSQL';
import { parseFilterFuzzy } from './parserFuzzy';
import FiltersContext from './context/filterscontext';
import {translations} from "./assets/translations"
import { isMobile } from 'react-device-detect';
import { TableHandler } from './Table';
import { GPaginationObject, LineSpacing } from './types/entities';
import { DataRequestParam, DefaultFiltersOptions, FilterStateItem, SorterRecord } from './types/entities';
import { createDefaultFilter, cleanFilterOnlyWithLocked } from './helpers/createDefaultFilters';
import { ExportType, SSTHandler, SSTProps } from './types/components-props';
import { destroyTableFiltersStorage,  getTableFilters, registerTableFilters } from './helpers/SSTlocalStorageManagement';

FiltersContext.displayName = "ServerSideTableContext";

const ServerSideTable = forwardRef<SSTHandler, SSTProps>((props, ref) => {

    const {translationsProps, marginPagesDisplayed = 2, pageRangeDisplayed = 2} = props     

    // @ts-ignore
    const [filtersState, setFiltersState] = useState<FilterStateItem>(!!props.tableId && !!props.defaultProps?.filters ? _.cloneDeep(props.defaultProps.filters) : 
                                                                    !!props.tableId ? getTableFilters(props.tableId) : 
                                                                    !!props.defaultProps?.filters ? _.cloneDeep(props.defaultProps.filters) : {})
    // @ts-ignore
    const [submitFiltersState, setSubmitFilterState] = useState<FilterStateItem>(!!props.tableId && !!props.defaultProps ? _.cloneDeep(props.defaultProps.filters) :
                                                                                !!props.tableId ? getTableFilters(props.tableId)  : 
                                                                                !!props.defaultProps?.filters ? _.cloneDeep(props.defaultProps.filters) : {})

                                                                    
    const [sorterState, setSorterState] = useState<SorterRecord>(!!props.defaultProps?.sort ? props.defaultProps.sort : null )
    const [submitSorter, setSubmitSorter] = useState<string[]>(!!props.defaultProps?.sort ? Object.values(props.defaultProps.sort)
                                                                                                    .filter(sorter => !!sorter.value)
                                                                                                    .map(sorter => sorter.attribut + ',' + sorter.value) : [])
	
    
    const [offset, setOffset] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(null)
    const [perPage, setPerPage] = useState<number>(!!props.defaultProps?.perPageItems ? props.defaultProps.perPageItems : !!props.perPageItems ? props.perPageItems : 999);
    const [parsedFilters, setParsedFilters] = useState<any>(null)
    const tableRef = useRef<TableHandler>(null)
    const [data, setData] = useState<GPaginationObject<any>>(null)
    const lockedFilters: string[] = (!!props.defaultProps ? Object.keys(props?.defaultProps.filters).filter(f => props?.defaultProps.filters[f]["locked"]) : [])
    const [loading, setLoading] = useState<boolean>(false)
    const [haveSelectedRows, setHaveSelectedRows] = useState<boolean>(false)
    const [hiddenColumns, setHiddenColumns] = useState<string[]>(!!props.defaultProps?.hideColumns ? props.defaultProps.hideColumns : [])
    const [lineSpacing, setLineSpacing] = useState<LineSpacing>(!!props.defaultProps?.lineSpacing ? props.defaultProps.lineSpacing : "medium")
    const [showVerticalBorders, setShowVerticalBorders] = useState<boolean>(!!props.showVerticalBorders ? true : !!props.defaultProps?.showVerticalBorders ? props.defaultProps.showVerticalBorders : false)
    const isInitialMount = useRef(true);

    useEffect(() => {
        if(!props.defaultProps && !!props.isFilter && !!props.filtersList && props.filtersList.length > 0){
            setFiltersState(createDefaultFilter(props.filtersList, props.defaultProps?.filters, props.tableId, props.filterParsedType))
        }
    }, [props.filtersList])

    useEffect(() => {
        if(isInitialMount.current)
            return
        else if(!!props.defaultProps){
            setFiltersState(_.cloneDeep(props.defaultProps.filters))
            setSubmitFilterState(_.cloneDeep(props.defaultProps.filters))
        }
    }, [props.defaultProps])

    const updateDataOnChange = (requestParam: DataRequestParam) => {
        setLoading(true)
        props.onDataChange(requestParam)
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
    
	useEffect(() => {
        if(isInitialMount.current)
            isInitialMount.current = false
        else {
            updateDataOnChange({offset,perPage,filters: parsedFilters, sorter: submitSorter})

        }
    }, [offset, perPage])

    useImperativeHandle(ref, () => ({
        reloadData() {
            updateDataOnChange({offset,perPage,filters: parsedFilters, sorter: submitSorter})
        },
        getSelectedRows(): any[] {
            return tableRef.current.getSelectedRows()
        }
    }))

    useEffect(() => {
        if(isInitialMount.current)
            isInitialMount.current = false
        else if(!!submitFiltersState){
            //Filter can be a string query or object with mulitple properties inside
            if(!!submitFiltersState && !_.isEmpty(submitFiltersState))
                registerTableFilters({filters: submitFiltersState, perPageItems: perPage}, props.tableId)
            let filters = props.filterParsedType === "rsql" 
            ? parseFilterRSQL(submitFiltersState)
            : parseFilterFuzzy(submitFiltersState)
            if(props.filterParsedType === "rsql" || props.filterParsedType === "fuzzy"){
                setParsedFilters(filters)
                setOffset(0)
                updateDataOnChange({offset,perPage,filters, sorter: submitSorter})
            }  else {
                setOffset(0)
                updateDataOnChange({offset,perPage,filters: null, sorter: submitSorter})
            }
        } 
    }, [submitFiltersState])

    const handleFilterSubmit = (filters: any) => {
        setOffset(0)
        setParsedFilters(filters)
        updateDataOnChange({offset,perPage,filters,sorter: submitSorter})


    }
    
    const changeMainFilter = (name: string, content: {option:DefaultFiltersOptions, value:string}) => {
        let _filter = filtersState[name]
        _filter["main"] = {option: content.option, value:content.value}
        setFiltersState({
            ...filtersState,
            [name]: _filter
        })
    }

    const changeOptionalsFilters = (name: string, content: {option:DefaultFiltersOptions, value:string}[]) => {
        let _filter = filtersState[name]
        _filter["optionals"] = content
        setFiltersState({
            ...filtersState,
            [name]: _filter
        })
    }

    const onClickApply = () => {
        let _object = _.cloneDeep(filtersState)
        setSubmitFilterState(_object)
        return;
    }

    const onClearAll = () => {
        let _initialFilters = cleanFilterOnlyWithLocked(props.filtersList, props.defaultProps.filters, lockedFilters)
        setFiltersState(_.cloneDeep(_initialFilters))
        setSubmitFilterState(!!lockedFilters ? _.cloneDeep(_initialFilters) : {})
        destroyTableFiltersStorage(props.tableId)
        return;
    }

    const onSortChange = (e: SorterRecord) => {
        let _test = Object.values(e)
            .filter(sorter => !!sorter.value)
            .map(sorter => sorter.attribut + ',' + sorter.value)
        setSorterState(e)
        setSubmitSorter(_test)

        registerTableFilters({sort: e}, props.tableId)
        updateDataOnChange({offset,perPage,filters: parsedFilters, sorter: _test})

    }

    const onHeaderClick = (e: any) => {
        //DO SOMETHING ?
    };

    const onLineSpacingChange = (e: LineSpacing) => {
        setLineSpacing(e)
        registerTableFilters({lineSpacing: e}, props.tableId)
    }

    const onShowVerticalBorderChange = (e: boolean) => {
        setShowVerticalBorders(e)
        registerTableFilters({showVerticalBorders: e}, props.tableId)
    }

    function exportData(e: ExportType): Promise<any> {
        if(e === "one"){
            return props.onDataChange({offset,perPage,filters: parsedFilters, sorter: submitSorter})
            .then(data => {
                if(!!data && !!data?.content){
                    return data
                } else {
                    return {content: []}
                }
            })
        } else {
            return props.onDataChange({offset: 0, perPage: 999,filters: parsedFilters, sorter: submitSorter})
            .then(firstData => {
                if(firstData.totalElements > 999){
                    let _apiCalls = []
                    for(let i = 1; i < firstData.totalPages; i++) 
                        _apiCalls.push(props.onDataChange({offset: i, perPage: 999,filters: parsedFilters, sorter: submitSorter}))
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

    return(
        <FiltersContext.Provider value={{
            filtersState: filtersState,
            submitFiltersState: submitFiltersState,
            sorterState: sorterState,
            changeSort: onSortChange,
            changeMainFilter: changeMainFilter,
            changeOptionalsFilters: changeOptionalsFilters,
            onClearAll: onClearAll,
            onClickApply: onClickApply,
        }}>
            <TableContainer darkMode={props.darkMode} className="SST_container">
                <TableStyles lineSpacing={lineSpacing} className={props.containerClassName} darkMode={props.darkMode}>
                    {!props.withoutHeader && 
                        <div className="SST_HEADER">
                            <div className="SST_actions_buttons">
                                {props.showAddBtn && 
                                    <button className="btn bg-plain-primary sst_main_button"  onClick={() => props.onAddClick()}>
                                            {translationsProps?.add ?? translations.add}
                                    </button>}
                                {!!props.optionnalsHeaderContent && props.optionnalsHeaderContent}
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', width: "100%", justifyContent: "space-between", flexDirection: "row-reverse"}} className="table-actions-container">
                                <div className="icons">
                                    {!isMobile &&
                                        <SettingsInteractor 
                                            columns={props.columns}
                                            hiddenColumns={hiddenColumns}
                                            onHiddenColumnsChange={(e: string[]) => setHiddenColumns(e)}
                                            onLineSpacingChange={onLineSpacingChange}
                                            translationsProps={translationsProps}
                                            enabledExport={props.enabledExport}
                                            handleExport={exportData}
                                            darkMode={props.darkMode}
                                            tableId={props.tableId}
                                            lineSpacing={lineSpacing}
                                            showVerticalBorders={showVerticalBorders}
                                            onShowVerticalBorderChange={onShowVerticalBorderChange}/>
                                    }
                                </div>
                                {props.isFilter && !!props.filtersList && props.filtersList.length > 0 && 
                                <>
                                    <FiltersContainer darkMode={props.darkMode} className={`${props.filtersContainerClassName ?? ""} SST_filters_container`}>
                                        <FiltersViewers translationsProps={translationsProps} darkMode={props.darkMode} lockedFilters={lockedFilters}/>
                                        {isMobile && 
                                            <FiltersInteract 
                                                filters={props.filtersList} 
                                                onSubmit={e => handleFilterSubmit(e)} 
                                                filterParsedType={props.filterParsedType}
                                                translationsProps={translationsProps}
                                                darkMode={props.darkMode}
                                                isMobile={isMobile}/>
                                        }
                                    </FiltersContainer>
                                </>
                        }
                            </div>
                        </div>
                    }
                        <>
                        {!!props.selectableRows && !!props.selectedRowsAction && haveSelectedRows &&
                            <div className="SST_selected_rows_buttons">
                                {props.selectedRowsAction}
                            </div>
                        }
                        <Table 
                            ref={tableRef}
                            data={!data ? [] : data.content} 
                            clickableHeader={onHeaderClick}
                            columns={isMobile && !!props.mobileColumns ? props.mobileColumns : props.columns} 
                            renderRowSubComponent={props.isRenderSubComponent ? props.renderSubComponent : ""}
                            hiddenColumns={hiddenColumns}
                            filters={props.filtersList}
                            filterParsedType={props.filterParsedType} 
                            translationsProps={translationsProps}
                            selectableRows={props.selectableRows}
                            setHaveSelectedRows={setHaveSelectedRows}
                            showVerticalBorders={showVerticalBorders}
                            asyncLoading={loading}
                            onRowClick={props.onRowClick}
                            counterColumnToItemGoLeft={props.counterColumnToItemGoLeft}/>
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
                        {!!totalElements && !props.withoutTotalElements && <span className='font-italic medium'>Total : {totalElements} élement{totalElements > 1 && "s"}</span>}
                        <PerPageContainer>
                            <label htmlFor="perPageSelect">{translationsProps?.linePerPage ?? translations.linePerPage}</label>
                            <select 
                                name="perPageSelect" 
                                value={perPage} 
                                onChange={(e) => {
                                    setPerPage(parseInt(e.target.value))
                                    registerTableFilters({perPageItems: parseInt(e.target.value)}, props.tableId)
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

