import React, {useState, useEffect} from 'react'
import _ from "lodash"
import { ColumnsSelectorProps } from './types/components-props';
import { registerTableFilters } from './helpers/SSTlocalStorageManagement';

const ColumnsSelector = (props: ColumnsSelectorProps) => {

    const [checkedColumns, setCheckedColumns] = useState<string[]>(props.columns.filter(column => !!column.Header && column.Header.length > 0).map(column => column.accessor).filter(column => !props.hiddenColumns.includes(column)))
    const [uncheckedColumns, setUncheckedColumns] = useState<string[]>(props.hiddenColumns)

    useEffect(() => {
        props.onChange(uncheckedColumns)
        registerTableFilters({hideColumns: uncheckedColumns}, props.tableId)
    }, [uncheckedColumns])

    return(
        <>
            {props.columns.map((column,i) => {
                if(!!column.Header && column.Header.length > 0){
                    return(
                        <div className="check-group" style={{paddingTop: 10}} key={i}>
                            <input 
                                type="checkbox" 
                                name={column.accessor} 
                                id={column.accessor}  
                                onChange={() => {
                                    setCheckedColumns(_.xor(checkedColumns, [column.accessor]))
                                    setUncheckedColumns(_.xor(uncheckedColumns, [column.accessor]))
                                }} 
                                checked={checkedColumns.includes(column.accessor)}/>
                            <label htmlFor={column.accessor}>{column.Header}</label>
                        </div>
                    )
                }
            }
            )}
        </>
    )
}

export default ColumnsSelector