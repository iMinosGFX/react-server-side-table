import React, {useState, useEffect, useRef, createContext, useImperativeHandle, forwardRef } from 'react'
import Table from './Table'
import ReactPaginate from 'react-paginate';
import { TableStyles } from './assets/styled-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Select, {components} from 'react-select';
import _ from 'lodash';
import FiltersInteract, { FilterItem } from './FiltersInteract';
import SettingsInteractor from './SettingsInteractor';
import FiltersViewers from './FiltersViewers';
import { parseFilterRSQL } from './parserRSQL';
import { parseFilterFuzzy } from './parserFuzzy';

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
`

const TableContainer = styled("div")<{darkMode: boolean}>`
    padding-top: 10px;
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
    .btnActionsContainer{
        padding: .4rem;
        width: 100% auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 10px;
    }
    @media only screen and (max-width: 540px){
        .btnActionsContainer{
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

export type filtersType = "rsql" | "fuzzy"

type Props = {
    columns: any[]
    data: any[]
    isFilter?: boolean
    filtersList?: FilterItem[]
    isSorter?:boolean
    sorterSelect?:  {value:string, label:string}[]
    defaultSorter?: string
    perPageItems?: 5 | 10 | 20 | 50
    isRenderSubComponent?:boolean
    renderSubComponent?: any
    pageCount:number
    onDataChange({offset, perPage, filters}: {offset: number, perPage: number, filters: string | object}):void
    showAddBtn?: boolean
    onAddClick?(): void
    showOptionalBtn?:boolean
    optionalIconBtn?:any
    onOptionalBtnClick?():void
    filterParsedType?: filtersType
    darkMode?: boolean
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

export const FiltersContext = createContext({
    filtersState: null,
    submitFiltersState: null,
    changeMainFilter: (name: string, content: {option:string, value:string | any}) => {},
    changeOptionalsFilters: (name: string, content: {option:string, value:string}[]) => {},
    onClearAll:() => {},
    onClickApply:() => {},
})

const ServerSideTable = forwardRef((props: Props, ref) => {

    useEffect(() => {
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
    }, [])

    const [filters, setFilters] = useState<any>({})
    const [filtersState, setFiltersState] = useState({})
    const [submitFiltersState, setSubmitFilterState] = useState({})
	const [offset, setOffset] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(props.perPageItems ? props.perPageItems : 10);
    const [sorterOptions, setSorterOptions] = useState<{value:string, label:string, icon:any}[]>([])
    const [sorterValue, setSorterValue] = useState<{value:string, label:string, icon:any}>(null)
    const [lineSpacing, setLineSpacing] = useState<'high' | 'medium' | 'small'>('medium')
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([])
    const { Option } = components

    const isInitialMount = useRef(true);

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage)
    };
    
	useEffect(() => {
        if(isInitialMount.current)
            isInitialMount.current = false
        else 
		    props.onDataChange({offset,perPage,filters})
    }, [offset, perPage])
    
    useEffect(() => {
        if(isInitialMount.current)
            isInitialMount.current = false
        else {
            setOffset(0)
            props.onDataChange({offset,perPage,filters})
        }
    }, [filters])

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
          props.onDataChange({offset,perPage,filters})
        }
    }))

    useEffect(() => {
        try{
            if(props.isSorter && !!props.sorterSelect && props.sorterSelect.length > 0)
                setSorterOptions(props.sorterSelect.flatMap(filter => {
                    return ([
                        {
                            value: filter.value+",asc",
                            label: filter.label,
                            icon: <FontAwesomeIcon icon={faAngleDown} size="lg" style={{paddingLeft: 5}} color="#57606f" />
                        },
                        {
                            value: filter.value+",desc",
                            label: filter.label,
                            icon: <FontAwesomeIcon icon={faAngleUp} size="lg" style={{paddingLeft: 5}} color="#57606f"/>,
                        }])
                    }))
        } catch {
            console.log("Error when try to create sorter array")
        }
    }, [props.sorterSelect]) 

    useEffect(() => {
        if(!!props.sorterSelect){
            if(props.defaultSorter)
                setSorterValue(sorterOptions.find(el => el.value === props.defaultSorter))
        } else {
            setSorterValue(null)
        }
    }, [sorterOptions])

    useEffect(() => {
        //Filter can be a string query or object with mulitple properties inside
        let filters = props.filterParsedType === "rsql" 
        ? parseFilterRSQL(submitFiltersState)
        : parseFilterFuzzy(submitFiltersState)
        if((props.filterParsedType === "rsql" && !!filters && !_.isEmpty(filters)) || props.filterParsedType === "fuzzy"){
            setOffset(0)
            props.onDataChange({offset,perPage,filters})
        }  
    }, [submitFiltersState])

    const handleFilterSubmit = (filters: any) => {
        setOffset(0)
        setFilters(filters)
        props.onDataChange({offset,perPage,filters})
    }
    
    const handleRemoveFilter = (propertyName: string) => {
        setFilters(_.omit(filters, propertyName))
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
                optionals: [],
            }
        })
        setFiltersState(_initialFilters)
        setSubmitFilterState(null)
    }

    return(
        <FiltersContext.Provider value={{
            filtersState,
            submitFiltersState,
            changeMainFilter,
            changeOptionalsFilters,
            onClearAll,
            onClickApply
        }}>
            <TableContainer darkMode={props.darkMode}>
                <div className="row">
                    <div className={`md-12  arrayCard`}>
                        <div className="">
                            <TableStyles lineSpacing={lineSpacing}>
                                <div className="btnActionsContainer">
                                    {props.showAddBtn ? <button className="btn bg-primary light" onClick={props.onAddClick}>+ Ajouter</button> : <div></div>}
                                    <div style={{display: 'flex', alignItems: 'center'}} className="table-actions-container">
                                    {props.isSorter && !!props.sorterSelect && props.sorterSelect.length > 0 &&
                                            <div className="selectContainer">
                                                <Select 
                                                    options={sorterOptions}
                                                    components={{ Option: CustomSelectOption, SingleValue: CustomSelectValue }}
                                                    isClearable
                                                    onChange={(e, triggeredAction) => {
                                                        if(triggeredAction.action === "clear") {
                                                            setFilters({...filters, sort: null})                                        
                                                            setSorterValue(null)
                                                        }
                                                        else {
                                                            setFilters({...filters, sort:e.value})
                                                            setSorterValue(e)
                                                        }
                                                    }}
                                                    value={sorterValue}
                                                    classNamePrefix="ServerSideTableFilterSelect"
                                                    placeholder="Trier par..."/>
                                            </div>
                                    }
                                    <div className="icons">
                                        <SettingsInteractor 
                                            columns={props.columns} 
                                            onHiddenColumnsChange={(e: string[]) => setHiddenColumns(e)}
                                            onLineSpacingChange={e => setLineSpacing(e)}/>
                                    </div>
                                    </div>
                                </div>
                                {props.data &&
                                    <>
                                        <FiltersViewers />
                                        {Object.keys(filters).length > 0 && 
                                            <p style={{paddingTop: 20}}>
                                                Filtres appliqués :  
                                                {Object.entries(props.filtersList).map(([key, value]) => {
                                                    if(_.has(filters, value["name"]) && filters[value["name"]].length > 0){ 
                                                        return(
                                                            <span key={value["name"]} style={{padding: '5px 8px', background:"#e9e9e9", borderRadius: 5, margin: '0 5px'}}>
                                                                <span className='font-heavy'>{value['label']} : </span>
                                                                <span>{filters[value["name"]]}</span>
                                                                <FontAwesomeIcon icon={faTimes} size="sm" style={{marginLeft: 5, cursor: "pointer"}} onClick={() => handleRemoveFilter(value["name"])}/>
                                                            </span>
                                                        )
                                                    }  
                                                })}
                                            </p>
                                        }
                                        {props.isFilter && 
                                            <FiltersInteract filters={props.filtersList} onSubmit={e => handleFilterSubmit(e)} filterParsedType={props.filterParsedType}/>
                                        }
                                        <Table 
                                            data={props.data} 
                                            columns={props.columns} 
                                            renderRowSubComponent={props.isRenderSubComponent ? props.renderSubComponent : ""}
                                            // filters={props.filtersList}
                                            hiddenColumns={hiddenColumns}/>
                                    </>
                                }
                                <div className="footerTable">
                                    <ReactPaginate
                                        previousLabel={<FontAwesomeIcon icon={faChevronLeft}/>}
                                        nextLabel={<FontAwesomeIcon icon={faChevronRight}/>}
                                        breakLabel={"..."}
                                        breakClassName={"break-me"}
                                        pageCount={props.pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={2}
                                        onPageChange={handlePageClick}
                                        containerClassName={"paginationTable"}
                                        subContainerClassName={"pages paginationTable"}
                                        activeClassName={"active"} />
                                    <PerPageContainer>
                                        <label htmlFor="perPageSelect">Éléments par page</label>
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
                        </div>
                    </div>
                </div>
            </TableContainer>
        </FiltersContext.Provider>
    )
})

export default ServerSideTable