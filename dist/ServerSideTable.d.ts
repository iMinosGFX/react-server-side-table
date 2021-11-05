import React, { ReactElement } from 'react';
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
declare type optionalIconContent = {
    icon: ReactElement;
    text: string;
};
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
    showOptionalBtn?: boolean;
    optionalIconContent?: optionalIconContent;
    onOptionalBtnClick?(): void;
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
};
declare const ServerSideTable: React.ForwardRefExoticComponent<Props & React.RefAttributes<unknown>>;
export default ServerSideTable;
