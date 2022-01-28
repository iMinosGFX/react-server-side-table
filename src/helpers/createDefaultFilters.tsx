import { FilterStateItem, SorterRecord } from "../types/entities"
import { getTableFilters } from './SSTlocalStorageManagement';
import _ from 'lodash';
import { FilterItem } from "../FiltersInteract";
import { parseFilterRSQL } from "../parserRSQL";
import { parseFilterFuzzy } from "../parserFuzzy";

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

export function createDefaultFilter (filtersList: FilterItem[], defaultFilters?: FilterStateItem, tableId?: string, filtersParsedType?: "rsql" | "fuzzy"): FilterStateItem{
    
    const savedFilters = getTableFilters(tableId);
    let concatFilters = {}

    let filters = filtersParsedType === "rsql" 
    ? parseFilterRSQL(savedFilters)
    : parseFilterFuzzy(savedFilters)

    if(!tableId || (!filters && _.isEmpty(filters))){
        let _initialFilters = {};
        filtersList.forEach(filter => {
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
        concatFilters = {..._initialFilters, ...defaultFilters}
    } else {
        if(!!defaultFilters)
            concatFilters = defaultFilters;
        if(!!tableId && !_.isEmpty(savedFilters))
            concatFilters = {...defaultFilters, ...savedFilters}
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

    if(!!lockedFilters){
        // let _test: any = Object.keys(defaultFilters).filter(a => lockedFilters?.includes(a)).map(v => v) //Get Array of lockedFilters id attribut
        let clonedDefaultsWithProperties = defaultFilters //Clone Default filters
        Object.keys(defaultFilters).forEach(p => {      //Loop & create all lockeds objects ready to concat
            if(!lockedFilters.includes(p))
                delete clonedDefaultsWithProperties[p]
        })
        return {..._initialFilters, ...clonedDefaultsWithProperties}
    }
    return concatFilters = _initialFilters
}

export function createDefaultSorter(columns: any[]) {
    let  _initialSorter: SorterRecord = {};
    columns.forEach(column => {
        if(!!column.sorterAttribut){
            _initialSorter[column.accessor] = {
                attribut: column.sorterAttribut,
                value: undefined
            }
        }
    })
    return _initialSorter;
}