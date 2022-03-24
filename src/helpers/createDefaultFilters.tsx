import { FilterItem, FilterStateItem, LineSpacing, SorterRecord } from "../types/entities"
import { getTableFilters } from './localDbManagement';
import _ from 'lodash';
import { parseFilterRSQL } from "../parserRSQL";
import { parseFilterFuzzy } from "../parserFuzzy";
import { getDataFromTable } from "./localDbManagement";
import { DefaultProps } from "../types/components-props";

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

export async function createDefaultFilter (filtersList: FilterItem[], defaultFilters?: FilterStateItem, tableId?: string, filtersParsedType?: "rsql" | "fuzzy"): Promise<FilterStateItem>{
    
    const savedFilters = await getTableFilters(tableId);
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

export function createDefaultSorter(tableId: string, columns?: any[]): Promise<SorterRecord>{
    return getDataFromTable(tableId)
    .then(res => {
        if(!!res?.sort){
            return res.sort
        }
        else {
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
    })
}

export function getHiddenColumnsAndStyles(tableId: string): Promise<{hideColumns: string[], showVerticalBorders: boolean, lineSpacing: LineSpacing}>{
    return getDataFromTable(tableId)
    .then(res => ({
        hideColumns: res?.hideColumns,
        showVerticalBorders: res?.showVerticalBorders,
        lineSpacing: res?.lineSpacing
    }))
}

type Props = {
    filtersList: FilterItem[], 
    defaultFilters?: FilterStateItem, 
    tableId?: string, 
    filtersParsedType?: "rsql" | "fuzzy"
    columns: any[]
}


export async function createDefaultProps(props: Props): Promise<DefaultProps> {
    let _filters = await createDefaultFilter(props.filtersList, props.defaultFilters, props.tableId, props.filtersParsedType)
    let _sorts = await createDefaultSorter(props.tableId, props.columns)
    let _columnsAndStyles = await getHiddenColumnsAndStyles(props.tableId)
    return {
        filters: _filters,
        sort: _sorts,
        hideColumns: _columnsAndStyles.hideColumns,
        showVerticalBorders: _columnsAndStyles.showVerticalBorders,
        lineSpacing: _columnsAndStyles.lineSpacing
    }
}