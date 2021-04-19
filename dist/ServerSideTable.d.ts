import React from 'react';
import { FilterItem } from './FiltersInteract';
export declare type filtersType = "rsql" | "fuzzy";
declare type Props = {
    columns: any[];
    data: any[];
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
    pageCount: number;
    onDataChange({ offset, perPage, filters }: {
        offset: number;
        perPage: number;
        filters: string | object;
    }): void;
    showAddBtn?: boolean;
    onAddClick?(): void;
    showOptionalBtn?: boolean;
    optionalIconBtn?: any;
    onOptionalBtnClick?(): void;
    filterParsedType?: filtersType;
    darkMode?: boolean;
};
export declare const FiltersContext: React.Context<{
    filtersState: any;
    submitFiltersState: any;
    changeMainFilter: (name: string, content: {
        option: string;
        value: any;
    }) => void;
    changeOptionalsFilters: (name: string, content: {
        option: string;
        value: string;
    }[]) => void;
    onClearAll: () => void;
    onClickApply: () => void;
}>;
declare const ServerSideTable: React.ForwardRefExoticComponent<Props & React.RefAttributes<{}>>;
export default ServerSideTable;
