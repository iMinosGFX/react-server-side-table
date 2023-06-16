import { DataRequestParam, FilterItem, FilterStateItem, filtersType, FilterType, GPaginationObject, LineSpacing, NewDefaultFilterItem, NewFilterItem, SorterRecord } from './entities';
import { Translations } from "./props"

export type CommonInputFilterProps = {
    filter: NewFilterItem
    onEnterPress(): void
    id: number
    filterParsedType: filtersType
    translationsProps: Translations
    darkMode: boolean
    type: FilterType
}

export type CheckboxFilterProps = {
    filter: NewFilterItem
    darkMode: boolean
}

export type BooleanRadioFilterProps = {
    filter: NewFilterItem
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

export type SSTExporter = {
    accessor: string
    exportFormat: any
}

type SSTCustomActions = {
    text: string, 
    onClick(): void
    icon?: JSX.Element, 
    color?: string,
}

export type SSTProps = {
    columns: any[]
    isFilter?: boolean
    // filtersList?: FilterItem[]
    isSorter?:boolean
    defaultSorter?: string
    isRenderSubComponent?:boolean
    renderSubComponent?: any
    onDataChange(requestParam: DataRequestParam): Promise<GPaginationObject<any>>
    showAddBtn?: boolean
    onAddClick?(): void
    darkMode?: boolean
    withoutHeader?:boolean
    translationsProps?: Translations
    enabledExport?: boolean
    onExportClick?(): void
    onRowClick?(e: any):void
    mobileColumns?: any[] 
    containerClassName?:string
    filtersContainerClassName?:string
    tableId?: string // Only for save filter & sort
    optionnalsHeaderContent?: {[key: string]: SSTCustomActions}
    selectableRows?: boolean
    selectedRowsAction?: {[key: string]: SSTCustomActions}
    showVerticalBorders?: boolean
    defaultProps?: DefaultProps
    counterColumnToItemGoLeft?: number
    marginPagesDisplayed?:number
    pageRangeDisplayed?:number
    withoutTotalElements?: boolean
    smallTextsHeader?:boolean
    newFiltersList?: NewFilterItem[]
    newDefaultFilters?: NewDefaultFilterItem[]
    asDefaultFilters?:boolean
}



export type SSTHandler = {
    reloadData: () => void,
    getSelectedRows: () => any[]
}

export type TableProps = {
    columns: any
    data: any
    renderRowSubComponent: any
    // filters?: FilterItem[]
    newFilters?: NewFilterItem[]
    hiddenColumns: string[]
    clickableHeader(e: any): void
    // filterParsedType: filtersType
    translationsProps?: Translations
    selectableRows?: boolean
    showVerticalBorders?: boolean
    asyncLoading?: boolean
    onRowClick?(e: any): void
    counterColumnToItemGoLeft?: number
    smallTextsHeader?:boolean
    setHaveSelectedRows?: (e: boolean) => void
}

type DefaultProps = {
    sort?: SorterRecord,
    hideColumns?: string[] 
    showVerticalBorders?: boolean
    lineSpacing?: LineSpacing
    perPageItems?: number
}

export type ExportType = "all" | "one"