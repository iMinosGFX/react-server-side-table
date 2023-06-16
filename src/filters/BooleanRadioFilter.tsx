import React, {useContext, useEffect, useRef, useState} from 'react'
import styled  from 'styled-components';
import _ from "lodash"
import FiltersContext from "../context/filterscontext"
import { translations } from '../assets/translations';
import { CheckContainer} from '../assets/styled-components';
import { BooleanRadioFilterProps } from '../types/components-props';

const FilterContainer = styled.div`
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
    }
    .chevron{
        padding-right: 5px;
    }
}
.checksContainer{
    max-height: 300px;
    overflow: auto;
    .check-group{
        label{
            &:after{
                top: 2px;
            }
        }
    }
}
`

const BooleanRadioFilter = (props: BooleanRadioFilterProps) => {

    const {
        translationsProps, 
        darkMode, 
        filter
    } = props
    const filtersState = useContext(FiltersContext)
    const node = useRef()
    const [open, setOpen] = useState<boolean>(false)

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

    const handleChange = (status: "YES" | "NO" | "NA") => {
        filtersState.changeFilter(props.filter.name, filter.id, {
            option: filter.option,
            value: status
        })
    }

        return(
            <FilterContainer>
                <CheckContainer darkMode={darkMode}>
                    {filter.optionsValues.flatMap((radio,i) => {
                        return(
                            <div key={i}>
                                <label>{radio.label}</label>
                                <div style={{display: 'flex', paddingTop: 5}}>
                                    <label className="radio-container">
                                        <input type="radio" id={`radio_type_${filter.name}_YES`} name={`radio_type_${filter.name}_YES`} value="YES" checked={filter.value === "YES"} onChange={() => handleChange("YES")}/>
                                        <span>{translationsProps?.yes ?? translations.yes}</span>
                                    </label>
                                    <label className="radio-container">
                                        <input type="radio" id={`radio_type_${filter.name}_NO`} name={`radio_type_${filter.name}_NO`} value="NO" checked={filter.value === "NO"} onChange={() => handleChange("NO")}/>
                                        <span>{translationsProps?.no ?? translations.no}</span>
                                    </label>
                                    <label className="radio-container">
                                        <input type="radio" id={`radio_type_${filter.name}_NA`} name={`radio_type_${filter.name}_NA`} value="NA" checked={filter.value === "NA"} onChange={() => handleChange("NA")}/>
                                        <span>{translationsProps?.na ?? translations.na}</span>
                                    </label>
                                </div>
                            </div>
                        )
                    })}
                </CheckContainer>
            </FilterContainer>
        )
    // }
}

export default BooleanRadioFilter