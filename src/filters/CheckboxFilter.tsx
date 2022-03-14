import React, { useContext } from 'react'
import styled  from 'styled-components';
import _ from "lodash"
import FiltersContext from "../context/filterscontext"
import { CheckContainer } from '../assets/styled-components';
import { Checkbox } from '@optalp/react-optalp-pantheon';
import { CheckboxFilterProps } from '../types/components-props';

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
    
    const {darkMode} = props
    const filtersState = useContext(FiltersContext)

    const handleChange = (check: string) => {
        filtersState.changeMainFilter(props.filter.name, {
            option: filtersState.filtersState[props.filter.name]["main"].option,
            value: _.xor(filtersState.filtersState[props.filter.name]["main"].value, [check])
        })
    }

    // if(filtersPosition === "field"){
    //     return(
    //         <FieldContainer ref={node} onClick={() => {setOpen(true)}} darkMode={darkMode}>
    //             <label>{(!!filtersState.submitFiltersState && !!filtersState.submitFiltersState?.[props.filter.name] && filtersState?.submitFiltersState[props.filter.name]?.main?.value.length > 0) ? filtersState?.submitFiltersState[props.filter.name]?.main?.value.join(',') : "Choisir"}</label>
    //            {open &&
    //                     <CheckContainer filtersPosition={filtersPosition} darkMode={darkMode}>
    //                     {props?.filter?.checkboxValues.map((check,i) => (
    //                         <div className="check-group" style={{paddingTop: 10}} key={i}>
    //                             <input 
    //                                 type="checkbox" 
    //                                 name={check.value} 
    //                                 id={check.value}  
    //                                 onChange={() => handleChange(check.value)} 
    //                                 checked={filtersState.filtersState[props.filter.name]["main"].value.includes(check.value)}/>
    //                             <label htmlFor={check.value}>{check.label}</label>
    //                         </div>
    //                     ))}
    //                 </CheckContainer> 
    //            } 
    //         </FieldContainer>
    //     )
    // } else {

    return(
            <ListContainer>
                <CheckContainer darkMode={darkMode}>
                    {props.filter.checkboxValues.map((check,i) => (
                        <Checkbox 
                            name={check.value} 
                            label={check.label}
                            id={check.value}  
                            onChange={() => handleChange(check.value)} 
                            checked={filtersState.filtersState[props.filter.name]["main"].value.includes(check.value)} />

                      
                    ))}
                </CheckContainer>
            </ListContainer>
        )
    // }
}

export default CheckboxFilter