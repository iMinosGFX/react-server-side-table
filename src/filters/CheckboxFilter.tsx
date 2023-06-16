import React, { useContext } from 'react'
import styled  from 'styled-components';
import _ from "lodash"
import FiltersContext from "../context/filterscontext"
import { CheckContainer } from '../assets/styled-components';
import { CheckboxFilterProps } from '../types/components-props';
import Checkbox from '../components/Checkbox';

const ListContainer = styled.div`
    width: 100%;
    box-sizing: border-box;
    margin: 10px 0;
    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #888;
        cursor: pointer;
        label {
            font-size: 14px;
            font-weight: 400;
        }
        .chevron{
            padding-right: 5px;
        }
    }
`
const CheckboxFilter = (props: CheckboxFilterProps) => {
    
    const {darkMode, filter} = props
    const filtersState = useContext(FiltersContext)

    const handleChange = (check: string) => {
        filtersState.changeFilter(props.filter.name, filter.id, {
            option: filter.option,
            value: _.xor(filter.value, [check])
        })
    }

    return(
            <ListContainer>
                <CheckContainer darkMode={darkMode}>
                    {props.filter.optionsValues.map((check,i) => (
                        <Checkbox 
                            name={check.value} 
                            label={check.label}
                            id={check.value}  
                            onChange={() => handleChange(check.value)} 
                            checked={filter?.value?.includes(check.value)} />
                    ))}
                </CheckContainer>
            </ListContainer>
        )
    // }
}

export default CheckboxFilter