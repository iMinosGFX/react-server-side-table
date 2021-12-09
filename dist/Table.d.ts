import React from 'react';
import { FilterItem } from './FiltersInteract';
import { filtersType } from './ServerSideTable';
import { Translations } from './types/props';
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
    setHaveSelectedRows?: (e: boolean) => void;
};
export declare type TableHandler = {
    getSelectedRows: () => any[];
};
declare const Table: React.ForwardRefExoticComponent<Props & React.RefAttributes<TableHandler>>;
export default Table;
