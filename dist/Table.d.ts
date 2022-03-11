import React from 'react';
import { FilterItem } from './FiltersInteract';
import { Translations } from './types/props';
import { filtersType } from './types/entities';
declare type Props = {
    columns: any;
    data: any;
    renderRowSubComponent: any;
    filters?: FilterItem[];
    hiddenColumns: string[];
    clickableHeader(e: any): void;
    filterParsedType: filtersType;
    translationsProps?: Translations;
    selectableRows?: boolean;
    showVerticalBorders?: boolean;
    asyncLoading?: boolean;
    counterColumnToItemGoLeft?: number;
    setHaveSelectedRows?: (e: boolean) => void;
};
export declare type TableHandler = {
    getSelectedRows: () => any[];
};
declare const Table: React.ForwardRefExoticComponent<Props & React.RefAttributes<TableHandler>>;
export default Table;
