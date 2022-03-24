import { DataRequestParam, FilterItem, FilterStateItem, filtersType, GPaginationObject, LineSpacing, SorterRecord } from "./entities"
import { Translations } from "./props"

export type TextFilterProps = {
    filter: FilterItem
    onEnterPress(): void
    index: "main" | number
    filterParsedType: filtersType
    translationsProps: Translations
    darkMode: boolean
}

export type CheckboxFilterProps = {
    filter: FilterItem
    darkMode: boolean
}

export type BooleanRadioFilterProps = {
    filter: FilterItem
    translationsProps: Translations
    darkMode: boolean
}

export type ColumnsSelectorProps = {
    columns: any[]
    hiddenColumns:string[]
    onChange(e: string[]): void
    tableId: string
}

export type FiltersInteractProps = {
    filters?: FilterItem[]
    onSubmit(e: any): void
    filterParsedType: filtersType
    translationsProps?: Translations
    darkMode: boolean
    isMobile?:boolean
}

export type FiltersViewersProps = {
    translationsProps?: Translations
    darkMode: boolean
    lockedFilters?:string[]
}

export type SSTProps = {
    columns: any[]
    isFilter?: boolean
    filtersList?: FilterItem[]
    isSorter?:boolean
    defaultSorter?: string
    perPageItems?: 5 | 10 | 20 | 50
    isRenderSubComponent?:boolean
    renderSubComponent?: any
    onDataChange(requestParam: DataRequestParam): Promise<GPaginationObject<any>>
    showAddBtn?: boolean
    onAddClick?(): void
    filterParsedType?: filtersType
    darkMode?: boolean
    withoutHeader?:boolean
    translationsProps?: Translations
    enabledExport?: boolean
    onExportClick?(): void
    mobileColumns?: any[] 
    containerClassName?:string
    filtersContainerClassName?:string
    tableId?: string // Only for save filter & sort
    optionnalsHeaderContent?: JSX.Element[]
    selectableRows?: boolean
    selectedRowsAction?: JSX.Element[]
    showVerticalBorders?: boolean
    defaultProps?: DefaultProps
    counterColumnToItemGoLeft?: number
}

export type SSTHandler = {
    reloadData: () => void,
    getSelectedRows: () => any[]
}

export type TableProps = {
    columns: any
    data: any
    renderRowSubComponent: any
    filters?: FilterItem[]
    hiddenColumns: string[]
    clickableHeader(e: any): void
    filterParsedType: filtersType
    translationsProps?: Translations
    selectableRows?: boolean
    showVerticalBorders?: boolean
    asyncLoading?: boolean
    counterColumnToItemGoLeft?: number
    setHaveSelectedRows?: (e: boolean) => void
}

type DefaultProps = {
    filters: FilterStateItem,
    sort: SorterRecord,
    hideColumns: string[] 
    showVerticalBorders: boolean
    lineSpacing: LineSpacing
}