import _ from 'lodash';
import { LineSpacing, NewFilterItem, SorterRecord } from '../types/entities';

type Data = {
    filters?: NewFilterItem[],
    sort?: SorterRecord
    hideColumns?: string[]
    showVerticalBorders?: boolean
    lineSpacing?: LineSpacing
    perPageItems?:number
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
            filters: data?.filters ?? table?.filters ?? [],
            sort: data?.sort ?? table?.sort ?? null,
            hideColumns: data?.hideColumns ?? table?.hideColumns ?? [],
            showVerticalBorders: data?.showVerticalBorders ?? table?.showVerticalBorders ?? false,
            lineSpacing: data?.lineSpacing ?? table?.lineSpacing ?? "medium",
            perPageItems: data?.perPageItems ?? table?.perPageItems ?? null
        }))
    }
}

export function destroyTableFiltersStorage(tableId: string): void{
    localStorage.removeItem(tableId)
}