export function getLineSpacing(): string{
    if(!!localStorage.getItem('line-spacing-table')) 
        return localStorage.getItem('line-spacing-table')
    else 
        return 'medium';
}

export function saveLineSpacing(space: string): void{  
    localStorage.setItem('line-spacing-table', space)
}
