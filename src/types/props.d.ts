export type Translations = {
    add?:string,
    sortBy?: string,
    appliedFilters?:string,
    linePerPage?:string,
    clearAll?: string,
    clear?: string
    apply?:string
    filterFor?:string
    and?:string
    yes?:string
    no?:string
    na?:string
    loading?: string
    filtersViewer?: {
        contain?: string
        startWith?: string
        finishWith?: string
        equal?: string
        moreThan?: string
        lessThan?: string
        between?: string
        atDay?: string
        minDay?: string
        maxDay?: string
        kmAroundOf?: string
    }
    settings?:{
        toggleColumns?: string,
        lineSpacing?: string,
        export?: string,
        back?: string,
        highHeight?: string,
        mediumHeight?:  string,
        smallHeight?: string,
        filterType:string,
        filterList: string,
        filterField: string
        clearCache?: string
    }
}