import React from 'react';
import { FilterItem } from './FiltersInteract';
import { Translations } from './types/props';
export declare type filtersType = "rsql" | "fuzzy";
export declare type FiltersPosition = string;
export declare type Sort = {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
};
export declare type Pageable = {
    sort: Sort;
    pageNumber: number;
    pageSize: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
};
export declare type PaginationObject = {
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    size: number;
    number: number;
    empty: boolean;
};
export interface Data extends PaginationObject {
    content: any[];
}
export declare type Sorter = {
    attribut: string;
    value: string;
};
export interface SorterRecord {
    [key: string]: Sorter;
}
declare type Props = {
    columns: any[];
    data: Data;
    isFilter?: boolean;
    filtersList?: FilterItem[];
    isSorter?: boolean;
    sorterSelect?: {
        value: string;
        label: string;
    }[];
    defaultSorter?: string;
    perPageItems?: 5 | 10 | 20 | 50;
    isRenderSubComponent?: boolean;
    renderSubComponent?: any;
    onDataChange({ offset, perPage, filters }: {
        offset: number;
        perPage: number;
        filters: string | object;
        sorter?: string;
    }): void;
    showAddBtn?: boolean;
    onAddClick?(): void;
    filterParsedType?: filtersType;
    darkMode?: boolean;
    withoutHeader?: boolean;
    translationsProps?: Translations;
    enabledExport?: boolean;
    onExportClick?(): void;
    mobileColumns?: any[];
    containerClassName?: string;
    filtersContainerClassName?: string;
    tableId?: string;
    optionnalsHeaderContent?: JSX.Element[];
    selectableRows?: boolean;
    selectedRowsAction?: JSX.Element[];
    asyncLoading?: boolean;
    showVerticalBorders?: boolean;
};
export declare type SSTHandler = {
    reloadData: () => void;
    getSelectedRows: () => any[];
};
declare const ServerSideTable: React.ForwardRefExoticComponent<Props & React.RefAttributes<SSTHandler>>;
export default ServerSideTable;
