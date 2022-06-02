import _ from 'lodash';
import { LineSpacing, SorterRecord } from '../types/entities';

type Data = {
    filters?: any,
    sort?: SorterRecord
    hideColumns?: string[]
    showVerticalBorders?: boolean
    lineSpacing?: LineSpacing
}

export function getTableData(tableId?: string): Data{
    return !!tableId && !!localStorage.getItem(tableId) ? JSON.parse(localStorage.getItem(tableId)) : {}
}

export function getTableFilters(tableId?: string): Data{
    return !!tableId && !!localStorage.getItem(tableId) ? JSON.parse(localStorage.getItem(tableId))["filters"] : {}
}


export function registerTableFilters(data: Data, tableName: string): void {
    if(!!data && !_.isEmpty(data)){
        let table = getTableData(tableName)
        localStorage.setItem(tableName, JSON.stringify({
            filters: !!data.filters ? data.filters : !!table?.filters ? table.filters : null,
            sort: !!data.sort ? data.sort : !!table?.sort ? table.sort : null,
            hideColumns: !!data.hideColumns ? data.hideColumns : !!table?.hideColumns ? table.hideColumns : [],
            showVerticalBorders: data.showVerticalBorders !== undefined ? data.showVerticalBorders : table?.showVerticalBorders !== undefined ? table.showVerticalBorders : false,
            lineSpacing: !!data.lineSpacing ? data.lineSpacing : !!table?.lineSpacing ? table.lineSpacing : "medium",
        }))
    }
}

export function destroyTableFiltersStorage(tableId: string): void{
    localStorage.removeItem(tableId)
}