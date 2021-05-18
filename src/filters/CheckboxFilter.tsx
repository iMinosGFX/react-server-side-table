import React, { useContext } from 'react'
import { FilterItem } from '../FiltersInteract';
import styled  from 'styled-components';
import _ from "lodash"
import FiltersContext from "../context/filterscontext"

type Props = {
    filter: FilterItem
}

const FilterContainer = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 8px 5px;
    margin: 10px 0;
    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #888;
        cursor: pointer;
        label {
            font-size: 14px;
        }
        .chevron{
            padding-right: 5px;
        }
    }
    .checksContainer{
        max-height: 200px;
        overflow: auto;
        .check-group{
            label{
                color: #435F71 !important;
                &:after{
                    top: 2px;
                }
            }
        }
    }
`

const CheckboxFilter = (props: Props) => {
    
    const filtersState = useContext(FiltersContext)

    const handleChange = (check: string) => {
        filtersState.changeMainFilter(props.filter.name, {
            option: filtersState.filtersState[props.filter.name]["main"].option,
            value: _.xor(filtersState.filtersState[props.filter.name]["main"].value, [check])
        })
    }

    return(
        <FilterContainer>
            <div className="checksContainer">
                {props.filter.checkboxValues.map((check,i) => (
                    <div className="check-group" style={{paddingTop: 10}} key={i}>
                        <input 
                            type="checkbox" 
                            name={check.value} 
                            id={check.value}  
                            onChange={() => handleChange(check.value)} 
                            checked={filtersState.filtersState[props.filter.name]["main"].value.includes(check.value)}/>
                        <label htmlFor={check.value}>{check.label}</label>
                    </div>
                ))}
            </div>
        </FilterContainer>
    )
}

export default CheckboxFilter