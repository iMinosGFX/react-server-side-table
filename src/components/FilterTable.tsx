import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import styled from 'styled-components';

const FilterTableContainer = styled("div")<{isExtend: boolean, columnLength: number, filterInputsMaxWidth: number}>`
    display: ${props => props.isExtend ? "block" : "none"};
    .inputContainer{
        width: ${props => 100 / props.columnLength - 5}%;
        max-width: ${props => props.filterInputsMaxWidth}%;
        float:left;
        margin-left:15px;
    input[type='text']{
        height: 2.4rem;
        line-height: 2.4rem;
    }
    .reactSelectInput__input{
        input{
            height: 1rem !important;
        }                                                                   
    }               
    }
`

type Props = {
    columns: {name: string,label: string, filterType:string, selectOptions?: {value:string, label:string}[]}[]
    onFilterChange(filters): void
    isExtend:boolean
    filterInputsMaxWidth?: number
}

const FilterTable = (props: Props) => {

    const [filters, setFilters] = useState({})

    useEffect(() => {
        props.onFilterChange(filters)
    }, [filters])

    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget
        setFilters({...filters, [name]:value})
    }

    return(
        <>
            <FilterTableContainer isExtend={props.isExtend} columnLength={props.columns.length} filterInputsMaxWidth={props.filterInputsMaxWidth ? props.filterInputsMaxWidth : 10}>
                {props.columns.map(input => {
                    if(input.filterType === "select" && !!input.selectOptions){
                        return(
                            <div key={input.name} className="inputContainer">
                                <label htmlFor={input.name}>{input.label}</label>
                                <Select
                                    options={input.selectOptions}
                                    classNamePrefix="reactSelectInput"
                                    isClearable
                                    onChange={(e, triggeredAction) => {
                                        if(triggeredAction.action === "clear")
                                            setFilters({...filters, [input.name]: null})                                        
                                        else
                                            setFilters({...filters, [input.name]: e.value})
                                    }}
                                />
                            </div>
                        )
                    } else {
                        return(
                            <div key={input.name} className="inputContainer">
                                <label htmlFor={input.name}>{input.label}</label>
                                <input 
                                    name={input.name}
                                    type={input.filterType}
                                    onChange={handleChange}
                                    value={filters[input.name] ? filters[input.name] : ""}
                                />
                            </div>
                        )
                    }
                })}
            </FilterTableContainer>
        </>
    )
}

export default FilterTable