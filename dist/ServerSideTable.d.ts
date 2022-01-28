import React from 'react';
import { FilterItem } from './FiltersInteract';
import { Translations } from './types/props';
import { GPaginationObject } from './types/entities';
import { DataRequestParam, FilterStateItem, filtersType, SorterRecord } from './types/entities';
declare type Props = {
    columns: any[];
    isFilter?: boolean;
    filtersList?: FilterItem[];
    isSorter?: boolean;
    defaultSorter?: string;
    perPageItems?: 5 | 10 | 20 | 50;
    isRenderSubComponent?: boolean;
    renderSubComponent?: any;
    onDataChange(requestParam: DataRequestParam): Promise<GPaginationObject<any>>;
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
    showVerticalBorders?: boolean;
    defaultFilters?: FilterStateItem;
    defaultSorters?: SorterRecord;
};
export declare type SSTHandler = {
    reloadData: () => void;
    getSelectedRows: () => any[];
};
declare const ServerSideTable: React.ForwardRefExoticComponent<Props & React.RefAttributes<SSTHandler>>;
export default ServerSideTable;
