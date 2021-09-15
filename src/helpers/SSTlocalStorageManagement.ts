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
