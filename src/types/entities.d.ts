export type filtersType = "rsql" | "fuzzy"

export type FiltersPosition = string

export type Sort = {
    sorted: boolean,
    unsorted: boolean,
    empty: boolean
}

export type Pageable = {
    sort: Sort
    pageNumber: number,
    pageSize: number,
    offset: number,
    unpaged: boolean,
    paged: boolean
}

export type PaginationObject = {
    pageable: Pageable
    last: boolean,
    totalPages: number,
    totalElements: number,
    sort: Sort
    numberOfElements: number,
    first: boolean,
    size: number,
    number: number,
    empty: boolean
}


export type Sorter = {
    attribut: string,
    value: "asc" | "desc"
}

export interface SorterRecord {
    [key:string]: Sorter
}

export interface DataRequestParam {
    offset: number, 
    perPage: number, 
    filters: string | object, 
    sorter?:string
}

export type FilterType = "text" | "number" | "date" 
export type TextFilter = "contains" | "equal" | "startWith" | "finishWith"
export type NumberFilter = "equal" | "moreThan" | "lessThan" | "between"
export type DateFilter = "atDay" | "minDay" | "maxDay"

export type DefaultFiltersOptions = TextFilter | NumberFilter | DateFilter


export type FilterStateItemValue = {
    option: DefaultFiltersOptions,
    value: string
}

export interface FilterStateItem {
    [key:string]: {
        type?: FilterType,
        label?: string,
        parsedValue?: string,
        main?: FilterStateItemValue              
        optionals?: FilterStateItemValue[]
        locked?: boolean
    }
}

export type GPaginationObject<T> = {
    pageable: Pageable
    last: boolean,
    totalPages: number,
    totalElements: number,
    sort: Sort
    numberOfElements: number,
    first: boolean,
    size: number,
    number: number,
    empty: boolean
    content: T[]
}