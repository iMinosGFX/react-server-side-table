import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import Table from './Table'
import ReactPaginate from 'react-paginate';
import { TableStyles } from './assets/styled-components';
import styled from 'styled-components';
import Select, {components} from 'react-select';
import _ from 'lodash';
import FiltersInteract, { FilterItem } from './FiltersInteract';
import SettingsInteractor from './SettingsInteractor';
import FiltersViewers from './FiltersViewers';
import { parseFilterRSQL } from './parserRSQL';
import { parseFilterFuzzy } from './parserFuzzy';
import FiltersContext from './context/filterscontext';
import { getLineSpacing, getTableFilters, registerTableFilters, destroyTableFiltersStorage } from './helpers/SSTlocalStorageManagement';
import {translations} from "./assets/translations"
import { Translations } from './types/props';
import { isMobile } from 'react-device-detect';
import { TableHandler } from './Table';

const PerPageContainer = styled.div`
	float: right;
    transform: translateY(3px);
    padding-right: 10px;
	label{
		padding-right: 10px;
	}
	select{
		height: 40px;
		width: 20px;
	}
    .perPageSelect {
        color: #A3A6C0;
    }
`

const TableContainer = styled("div")<{darkMode: boolean}>`
    padding-top: 10px;
    margin: 0 5px;
    .extender{
        position: absolute; 
        top: -25px;
        left:0;
        width: 40px;
        height: 25px;
        line-height: 25px;
        font-size: 18px;
        text-align: center; 
        background-color: #E0E0E0;
        color: #606060;
        border-radius: 5px 5px 0 0;
        cursor: pointer;
    }
    .selectContainer{
        display: inline-block !important;
        width: 250px;
        text-align: left;
        padding-right: 20px;
        .ServerSideTableFilterSelect__control{
            background: ${props => props.darkMode ? "#2a3c4e" : "#fff"};
            border:1px solid ${props => props.darkMode ? "#272d3a" : "#E0E0E0"};
            .ServerSideTableFilterSelect__placeholder{
                color: ${props => props.darkMode ? "#bccde0" : "#2a3c4e" };
            }
        }
        .ServerSideTableFilterSelect__menu{
            background: ${props => props.darkMode ? "#2a3c4e" : "#fff;"};
            color: ${props => props.darkMode ? "#bccde0" : "#435F71"};
        }
        .ServerSideTableFilterSelect__input{
            input{
                height: 1rem !important;
            }

        }   
    } 
    .SST_HEADER{
        padding: .4rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 10px;
        .SST_actions_buttons{
            display: flex;
            align-items: center;
            & > * {
                margin: 0 5px;
            }
        }
    }
    .SST_selected_rows_buttons{
        padding: .4rem;
        display: flex;
        align-items: center;
        & > * {
            margin: 0 5px;
        }
    }
    @media only screen and (max-width: 540px){
        .SST_HEADER{
            display: contents;
            button{
                float: right;
                margin-bottom: 10px;
            }
            .table-actions-container{
                clear: both;
                justify-content: space-between;
                margin-bottom: 10px;
            }
        }
    }
`

const FiltersContainer = styled('div')<{darkMode: boolean}>`
    padding: 0 10px;
`

export type filtersType = "rsql" | "fuzzy"

export type FiltersPosition = string

export type Sort = {
    sorted: boolean,
    unsorted: boolean,
    empty: boolean
}

export type Pageable = {
    sort: Sort
    pageNumber: number,
    pageSize: number,
    offset: number,
    unpaged: boolean,
    paged: boolean
}

export type PaginationObject = {
    pageable: Pageable
    last: boolean,
    totalPages: number,
    totalElements: number,
    sort: Sort
    numberOfElements: number,
    first: boolean,
    size: number,
    number: number,
    empty: boolean
}

export interface Data extends PaginationObject {
    content: any[]
}

export type Sorter = {
    attribut: string,
    value:string
}

export interface SorterRecord {
    [key:string]: Sorter
}

type Props = {
    columns: any[]
    data: Data
    isFilter?: boolean
    filtersList?: FilterItem[]
    isSorter?:boolean
    sorterSelect?:  {value:string, label:string}[]
    defaultSorter?: string
    perPageItems?: 5 | 10 | 20 | 50
    isRenderSubComponent?:boolean
    renderSubComponent?: any
    onDataChange({offset, perPage, filters}: {offset: number, perPage: number, filters: string | object, sorter?:string}):void
    showAddBtn?: boolean
    onAddClick?(): void
    filterParsedType?: filtersType
    darkMode?: boolean
    withoutHeader?:boolean
    translationsProps?: Translations
    enabledExport?: boolean
    onExportClick?(): void
    mobileColumns?: any[] 
    containerClassName?:string
    filtersContainerClassName?:string
    tableId?: string // Only for save filter & sort
    optionnalsHeaderContent?: JSX.Element[]
    selectableRows?: boolean
    selectedRowsAction?: JSX.Element[]
    asyncLoading?: boolean
    showVerticalBorders?: boolean
}

function getOptionsByType(type: string): string{
    switch(type){
        case 'text':
            return 'contains'
        case 'number':
            return 'equal'
        case 'date':
            return 'atDay'
        case 'geoloc':
            return '1'
        default: 
            return ''
    }
}

FiltersContext.displayName = "ServerSideTableContext";

export type SSTHandler = {
    reloadData: () => void,
    getSelectedRows: () => any[]
}

const ServerSideTable = forwardRef<SSTHandler, Props>((props, ref) => {

    const {translationsProps} = props

    useEffect(() => {
        console.log("COUCOU")
        console.log(!!props.isFilter)
        console.log(!!props.filtersList)
        console.log(props.filtersList.length > 0)
        if(!!props.isFilter && !!props.filtersList && props.filtersList.length > 0){
            if(!!props.tableId && !_.isEmpty(getTableFilters(props.tableId))) {
                setFiltersState(getTableFilters(props.tableId))
            } else {
                let _initialFilters = {};
                console.log(props.filtersList)
                props.filtersList.map(filter => {
                    _initialFilters[filter.name] = {
                        type: filter.type,
                        label: filter.label,
                        parsedValue: '',
                        main: {
                            option: getOptionsByType(filter.type), 
                            value: filter.type === "booleanRadio" ? 
                                filter.radioValues.map(value => ({name: value.value, status: "NA", label: value.label})) :
                                filter.type === "geoloc" ? {lat:0, lng: 0, display: ""} : ""
                        },                
                        optionals: []
                    }
                })
                console.log(_initialFilters)
                setFiltersState(_initialFilters)
            }

        }
        let  _initialSorter: SorterRecord = {};
        props.columns.map(column => {
            if(!!column.sorterAttribut){
                _initialSorter[column.accessor] = {
                    attribut: column.sorterAttribut,
                    value: undefined
                }
            }
        })
        setSorterState(_initialSorter)  
    }, [props.filtersList])

    const [filters, setFilters] = useState<any>({})
    const [filtersState, setFiltersState] = useState({})
    const [sorterState, setSorterState] = useState<SorterRecord>(null)
    const [submitFiltersState, setSubmitFilterState] = useState(!!props.tableId ? getTableFilters(props.tableId) : {})
	const [offset, setOffset] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(props.perPageItems ? props.perPageItems : 10);
    const [sorterOptions, setSorterOptions] = useState<{value:string, label:string, icon:any}[]>([])
    const [sorterValue, setSorterValue] = useState<{value:string, label:string, icon:any}>(null)
    const [lineSpacing, setLineSpacing] = useState<string>(getLineSpacing())
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([])
    const { Option } = components
    const [parsedFilters, setParsedFilters] = useState<any>(null)
    const [submitSorter, setSubmitSorter] = useState<string>("")
    const tableRef = useRef<TableHandler>(null)

    const isInitialMount = useRef(true);

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage)
    };
    
	useEffect(() => {
        if(isInitialMount.current)
        isInitialMount.current = false
        else {
            props.onDataChange({offset,perPage,filters: parsedFilters, sorter: submitSorter})
        }
    }, [offset, perPage])

    useEffect(() => {
        if(isInitialMount.current)
            isInitialMount.current = false
        else {
            if(!!sorterValue){
                setSubmitSorter(sorterValue?.value)
                // props.onDataChange({offset,perPage,filters: parsedFilters, sorter: sorterValue?.value})
            }
        }
    }, [sorterValue])
    
    const CustomSelectOption = props => (
        <Option {...props}>
          {props.data.label}
          {props.data.icon}
        </Option>
      )

    const CustomSelectValue = props => (
        <div>
          {props.data.label}
          {props.data.icon}
        </div>
    )

    useImperativeHandle(ref, () => ({
        reloadData() {
            props.onDataChange({offset,perPage,filters, sorter: submitSorter})
        },
        getSelectedRows(): any[] {
            return tableRef.current.getSelectedRows()
        }
    }))

    useEffect(() => {
        try{
            if(props.isSorter && !!props.sorterSelect)
                setSorterOptions(props.sorterSelect.flatMap(filter => {
                    return ([
                        {
                            value: filter.value+",asc",
                            label: filter.label,
                            icon: <i className="ri-arrow-up-s-line" style={{paddingLeft: 5}} color="#57606f" />
                        },
                        {
                            value: filter.value+",desc",
                            label: filter.label,
                            icon: <i className="ri-arrow-down-s-line" style={{paddingLeft: 5}} color="#57606f"/>,
                        }])
                    }))
        } catch {
            console.log("Error when try to create sorter array")
        }
    }, [props.sorterSelect]) 

    useEffect(() => {
        if(props.isSorter && !!props.sorterSelect){
            if(props.defaultSorter)
                setSorterValue(sorterOptions.find(el => el.value === props.defaultSorter))
        } else {
            setSorterValue(null)
        }
    }, [sorterOptions])

    useEffect(() => {
        if(isInitialMount.current)
            isInitialMount.current = false
        else if(!!submitFiltersState){
            //Filter can be a string query or object with mulitple properties inside
            registerTableFilters(props.tableId, submitFiltersState)
            let filters = props.filterParsedType === "rsql" 
            ? parseFilterRSQL(submitFiltersState)
            : parseFilterFuzzy(submitFiltersState)
            if(props.filterParsedType === "rsql" || props.filterParsedType === "fuzzy"){
                setParsedFilters(filters)
                setOffset(0)
                props.onDataChange({offset,perPage,filters, sorter: submitSorter})
            }  
        }
    }, [submitFiltersState])

    const handleFilterSubmit = (filters: any) => {
        setOffset(0)
        setFilters(filters)
        setParsedFilters(filters)
        props.onDataChange({offset,perPage,filters,sorter: submitSorter})
    }
    
    const changeMainFilter = (name: string, content: {option:string, value:string}) => {
        let _filter = filtersState[name]
        _filter["main"] = {option: content.option, value:content.value}
        setFiltersState({
            ...filtersState,
            [name]: _filter
        })
    }

    const changeOptionalsFilters = (name: string, content: {option:string, value:string}[]) => {
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
        let _initialFilters = {}
        props.filtersList.map(filter => {
            _initialFilters[filter.name] = {
                type: filter.type,
                label: filter.label,
                parsedValue: '',
                main: {
                    option: getOptionsByType(filter.type), 
                    value: filter.type === "booleanRadio" ? 
                        filter.radioValues.map(value => ({name: value.value, status: "NA", label: value.label})) :
                        filter.type === "geoloc" ? {lat:0, lng: 0, display: ""} : ""
                },                
                optionals: []
            }
        })
        setFiltersState(_initialFilters)
        setSubmitFilterState({})
        destroyTableFiltersStorage(props.tableId)
        return;
    }

    const onHeaderClick = (e: any) => {
        //DO SOMETHING ?
    };

    useEffect(() => {
        if(!!sorterState){
            let _stringSort = "";
            Object.values(sorterState).map(e => {
                if(!!e.value){
                    _stringSort += e.attribut+","+e.value
                }
            }) 
            setSubmitSorter(_stringSort)
            // props.onDataChange({offset,perPage,filters, sorter: _stringSort})
        }
    },[sorterState])

    useEffect(() => {
        if((!!sorterState || !!sorterValue) && !!submitSorter){
            props.onDataChange({offset,perPage,filters, sorter: submitSorter})
        }
    }, [submitSorter])

    const [haveSelectedRows, setHaveSelectedRows] = useState<boolean>(false)

    return(
        <FiltersContext.Provider value={{
            filtersState: filtersState,
            submitFiltersState: submitFiltersState,
            sorterState: sorterState,
            changeSort: setSorterState,
            changeMainFilter: changeMainFilter,
            changeOptionalsFilters: changeOptionalsFilters,
            onClearAll: onClearAll,
            onClickApply: onClickApply
        }}>
            <TableContainer darkMode={props.darkMode} className="SST_container">
                <TableStyles lineSpacing={lineSpacing} className={props.containerClassName} darkMode={props.darkMode}>
                    {!props.withoutHeader && 
                        <div className="SST_HEADER">
                            <div className="SST_actions_buttons">
                                {props.showAddBtn && 
                                    <button className="btn bg-plain-primary sst_main_button"  onClick={props.onAddClick}>
                                            {translationsProps?.add ?? translations.add}
                                    </button>}
                                {!!props.optionnalsHeaderContent && props.optionnalsHeaderContent}
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}} className="table-actions-container">
                            {props.isSorter && !!props.sorterSelect && props.sorterSelect.length > 0 && 
                                <div className="selectContainer">
                                    <Select 
                                        options={sorterOptions}
                                        components={{ Option: CustomSelectOption, SingleValue: CustomSelectValue }}
                                        isClearable
                                        onChange={(e, triggeredAction) => {
                                            if(triggeredAction.action === "clear") {
                                                props.onDataChange({offset,perPage,filters})
                                                setSorterValue(null)
                                            }
                                            else 
                                                setSorterValue(e)
                                            
                                        }}
                                        value={sorterValue}
                                        classNamePrefix="ServerSideTableFilterSelect"
                                        placeholder={translationsProps?.sortBy ?? translations.sortBy}/>
                                </div>
                            }
                            <div className="icons">
                                {!isMobile &&
                                    <SettingsInteractor 
                                        columns={props.columns}
                                        hiddenColumns={hiddenColumns}
                                        onHiddenColumnsChange={(e: string[]) => setHiddenColumns(e)}
                                        onLineSpacingChange={e => setLineSpacing(e)}
                                        translationsProps={translationsProps}
                                        enabledExport={props.enabledExport}
                                        onExportClick={props.onExportClick}
                                        darkMode={props.darkMode}/>
                                }
                                </div>
                            </div>
                        </div>
                    }
                        <>
                        {props.isFilter && !!props.filtersList && props.filtersList.length > 0 && 
                            <>
                                <FiltersContainer darkMode={props.darkMode} className={`${props.filtersContainerClassName ?? ""} SST_filters_container`}>
                                    <FiltersViewers translationsProps={translationsProps} darkMode={props.darkMode}/>
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
                        {!!props.selectableRows && !!props.selectedRowsAction && haveSelectedRows &&
                            <div className="SST_selected_rows_buttons">
                                {props.selectedRowsAction}
                            </div>
                        }
                        <Table 
                            ref={tableRef}
                            data={props.data?.content ?? []} 
                            clickableHeader={onHeaderClick}
                            columns={isMobile && !!props.mobileColumns ? props.mobileColumns : props.columns} 
                            renderRowSubComponent={props.isRenderSubComponent ? props.renderSubComponent : ""}
                            hiddenColumns={hiddenColumns}
                            filters={props.filtersList}
                            filterParsedType={props.filterParsedType} 
                            translationsProps={translationsProps}
                            selectableRows={props.selectableRows}
                            setHaveSelectedRows={setHaveSelectedRows}
                            showVerticalBorders={props.showVerticalBorders}
                            asyncLoading={props.asyncLoading}/>
                        </>
                    <div className="footerTable">
                        <ReactPaginate
                            previousLabel={<i className="ri-arrow-left-s-line" style={{transform: "translateY(2px)"}}/>}
                            nextLabel={<i className="ri-arrow-right-s-line" style={{transform: "translateY(2px)"}}/>}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={props.data?.totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={2}
                            onPageChange={handlePageClick}
                            containerClassName={"paginationTable"}
                            subContainerClassName={"pages paginationTable"}
                            activeClassName={"active"} />
                        <PerPageContainer>
                            <label htmlFor="perPageSelect">{translationsProps?.linePerPage ?? translations.linePerPage}</label>
                            <select name="perPageSelect" value={perPage} onChange={(e) => setPerPage(parseInt(e.target.value))} style={{background: "#fff", width: 30}}>
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
