import React, { useContext, useEffect, useRef, useState } from 'react'
import { FilterItem } from '../FiltersInteract';
import styled  from 'styled-components';
import _ from "lodash"
import FiltersContext from "../context/filterscontext"
import { Translations } from '../types/props';
import { FiltersPosition } from '../ServerSideTable';
import { CheckContainer, FieldContainer } from '../assets/styled-components';

type Props = {
    filter: FilterItem
    filtersPosition: FiltersPosition
    darkMode: boolean
}

const ListContainer = styled.div`
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
`
const CheckboxFilter = (props: Props) => {
    
    const {filtersPosition, darkMode} = props
    const filtersState = useContext(FiltersContext)
    const node = useRef()
    const [open, setOpen] = useState<boolean>(false)

    /**
     * useRef pour remove sidebar info au clic exterieur
     */
    const handleClick = e => {
        //@ts-ignore
        if (node.current && node.current.contains(e.target)) 
            return;
        else 
            setOpen(false)
        
    };
        
    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleChange = (check: string) => {
        filtersState.changeMainFilter(props.filter.name, {
            option: filtersState.filtersState[props.filter.name]["main"].option,
            value: _.xor(filtersState.filtersState[props.filter.name]["main"].value, [check])
        })
    }

    if(filtersPosition === "field"){
        return(
            <FieldContainer ref={node} onClick={() => {setOpen(true)}} darkMode={darkMode}>
                <label>{(!!filtersState.submitFiltersState && !!filtersState.submitFiltersState?.[props.filter.name] && filtersState?.submitFiltersState[props.filter.name]?.main?.value.length > 0) ? filtersState?.submitFiltersState[props.filter.name]?.main?.value.join(',') : "Choisir"}</label>
               {open &&
                    <CheckContainer filtersPosition={filtersPosition}>
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
                    </CheckContainer> 
               } 
            </FieldContainer>
        )
    } else {
        return(
            <ListContainer>
                <CheckContainer filtersPosition={filtersPosition}>
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
                </CheckContainer>
            </ListContainer>
        )
    }
}

export default CheckboxFilter