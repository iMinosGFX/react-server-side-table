import { FilterItem, FilterStateItem, LineSpacing, NewDefaultFilterItem, NewFilterItem, SorterRecord } from "../types/entities"
import _ from 'lodash';
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

export function newCreateDefaultFilter(filtersList: NewFilterItem[], defaultFilters?: NewDefaultFilterItem[], loadFromLocalStorage?: boolean): NewFilterItem[] {
    
    return filtersList?.map(filter => {
        let _df = defaultFilters?.filter(df => df.name === filter.name)?.[0] ?? null
        if(loadFromLocalStorage) 
            return {
                ...filter,
                id: 0,
                option: getOptionsByType(filter.type),
                value: _df?.value ?? filter?.value ?? null
            }

        return {
            ...filter,
            id: 0,
            value: filter.type === "booleanRadio" ? "NA" : null,
            option: getOptionsByType(filter.type),
            ..._df
        }
    }) ?? []
}

type Props = {
    filtersList: FilterItem[], 
    defaultFilters?: FilterStateItem, 
    tableId?: string, 
    filtersParsedType?: "rsql" | "fuzzy"
    columns: any[]
    defaultPerPageItems?: number
}
