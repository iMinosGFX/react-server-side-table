import React, {useState, useEffect} from 'react'
import _ from "lodash"

type Props = {
    columns: any[]
    onChange(e: string[]): void
}

const ColumnsSelector = (props: Props) => {

    const [checkedColumns, setCheckedColumns] = useState<string[]>(props.columns.filter(column => !!column.Header && column.Header.length > 0).map(column => column.accessor))
    const [uncheckedColumns, setUncheckedColumns] = useState<string[]>([])

    useEffect(() => {
        props.onChange(uncheckedColumns)
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