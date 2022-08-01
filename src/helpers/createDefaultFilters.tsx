import { FilterItem, FilterStateItem, LineSpacing, SorterRecord } from "../types/entities"
import _ from 'lodash';
import { parseFilterRSQL } from "../parserRSQL";
import { parseFilterFuzzy } from "../parserFuzzy";
import { DefaultProps } from "../types/components-props";
import { getTableFilters, getTableData } from './SSTlocalStorageManagement';

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

export function createDefaultFilter (filtersList: FilterItem[], defaultFilters?: FilterStateItem, tableId?: string, filtersParsedType?: "rsql" | "fuzzy"): FilterStateItem {
    
    const savedFilters = getTableFilters(tableId);
    let concatFilters = {}

    let filters = filtersParsedType === "rsql" 
    ? parseFilterRSQL(savedFilters)
    : parseFilterFuzzy(savedFilters)

    if((filtersParsedType === "fuzzy" && !(!tableId || (!filters && _.isEmpty(filters)))) || (filtersParsedType === "rsql" && (!tableId || (!filters && _.isEmpty(filters))))){
        let _initialFilters = {};
        filtersList.forEach(filter => {
            _initialFilters[filter.name] = {
                type: filter.type,
                label: filter.label,
                parsedValue: filter.parsedValue,
                main: {
                    option: getOptionsByType(filter.type), 
                    value: filter.type === "booleanRadio" ? 
                        filter.radioValues.map(value => ({name: value.value, status: "NA", label: value.label})) :
                        filter.type === "geoloc" ? {lat:0, lng: 0, display: ""} : ""
                },                
                optionals: [],
            }
        })
        concatFilters = {..._initialFilters, ...defaultFilters}
    } else {
        if(!!defaultFilters)
            concatFilters = defaultFilters;
        if(!!tableId && !_.isEmpty(savedFilters)){
            concatFilters = {...savedFilters,...defaultFilters}
        }
    }
    return concatFilters
}

export function cleanFilterOnlyWithLocked(filtersList: FilterItem[], defaultFilters?: FilterStateItem, lockedFilters?: string[]): FilterStateItem {
    let concatFilters = {}
    let _initialFilters = {};
    filtersList
    .filter(f => !lockedFilters?.includes(f.name))
    .forEach(filter => {
        _initialFilters[filter.name] = {
            type: filter.type,
            label: filter.label,
            parsedValue: filter.parsedValue,
            main: {
                option: getOptionsByType(filter.type), 
                value: filter.type === "booleanRadio" ? 
                    filter.radioValues.map(value => ({name: value.value, status: "NA", label: value.label})) :
                    filter.type === "geoloc" ? {lat:0, lng: 0, display: ""} : ""
            },                
            optionals: [],
        }
    })

    if(!!lockedFilters){
        let clonedDefaultsWithProperties = defaultFilters //Clone Default filters
        Object.keys(defaultFilters).forEach(p => {      //Loop & create all lockeds objects ready to concat
            if(!lockedFilters.includes(p))
                delete clonedDefaultsWithProperties[p]
        })
        return {..._initialFilters, ...clonedDefaultsWithProperties}
    }
    return concatFilters = _initialFilters
}

export function createDefaultSorter(tableId: string, columns?: any[]): SorterRecord{
    let _data = getTableData(tableId)
    if(_data.sort){
        return _data.sort
    } else {
        let  _initialSorter: SorterRecord = {};
        columns.forEach(column => {
            if(!!column?.sorterAttribut){
                _initialSorter[column.accessor] = {
                    attribut: column.sorterAttribut,
                    value: undefined
                }
            }
        })
        return _initialSorter;
    }
}

export function getHiddenColumnsAndStyles(tableId: string): {hideColumns: string[], showVerticalBorders: boolean, lineSpacing: LineSpacing, perPageItems: number}{
    let _data = getTableData(tableId)
    return ({
        hideColumns: _data.hideColumns,
        showVerticalBorders: _data.showVerticalBorders,
        lineSpacing: _data.lineSpacing,
        perPageItems: _data.perPageItems
    })
}

type Props = {
    filtersList: FilterItem[], 
    defaultFilters?: FilterStateItem, 
    tableId?: string, 
    filtersParsedType?: "rsql" | "fuzzy"
    columns: any[]
    defaultPerPageItems?: number
}


export function createDefaultProps(props: Props): DefaultProps {
    let _filters = createDefaultFilter(props.filtersList, props.defaultFilters, props.tableId, props.filtersParsedType)
    let _sorts = createDefaultSorter(props.tableId, props.columns)
    let _columnsAndStyles = getHiddenColumnsAndStyles(props.tableId)

    return {
        filters: _filters,
        sort: _sorts,
        hideColumns: _columnsAndStyles.hideColumns,
        showVerticalBorders: _columnsAndStyles.showVerticalBorders,
        lineSpacing: _columnsAndStyles.lineSpacing,
        perPageItems: !!_columnsAndStyles.perPageItems ? _columnsAndStyles.perPageItems : !!props.defaultPerPageItems ? props.defaultPerPageItems : 10
    }
}