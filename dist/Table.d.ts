import React from 'react';
import { TableProps } from './types/components-props';
export declare type TableHandler = {
    getSelectedRows: () => any[];
};
declare const Table: React.ForwardRefExoticComponent<TableProps & React.RefAttributes<TableHandler>>;
export default Table;
