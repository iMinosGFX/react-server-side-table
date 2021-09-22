import _ from 'lodash';
export function getLineSpacing(): string{
    if(!!localStorage.getItem('line-spacing-table')) 
        return localStorage.getItem('line-spacing-table')
    else 
        return 'medium';
}

export function saveLineSpacing(space: string): void{  
    localStorage.setItem('line-spacing-table', space)
}


export function getFilterType(): string{
    if(!!localStorage.getItem('filter-type-table')) 
        return localStorage.getItem('filter-type-table')
    else 
        return 'field';
}

export function saveFilterType(type: string): void{  
    localStorage.setItem('filter-type-table', type)
}

export function getTableFilters(tableId: string): any{
    return !!localStorage.getItem(tableId) ? JSON.parse(localStorage.getItem(tableId)) : {}
}

export function registerTableFilters(tableId: string, filters: any): void {
    if(!!filters && !_.isEmpty(filters)){
        localStorage.setItem(tableId, JSON.stringify(filters))
    }
}

export function destroyTableFiltersStorage(tableId: string): void{
    localStorage.removeItem(tableId)
}