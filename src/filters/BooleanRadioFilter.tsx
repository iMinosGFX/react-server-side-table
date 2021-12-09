import React, {useContext, useEffect, useRef, useState} from 'react'
import { FilterItem } from '../FiltersInteract';
import styled  from 'styled-components';
import _ from "lodash"
import FiltersContext from "../context/filterscontext"
import { Translations } from '../types/props';
import { translations } from '../assets/translations';
import { CheckContainer, FieldContainer } from '../assets/styled-components';

type Props = {
    filter: FilterItem
    translationsProps: Translations
    darkMode: boolean
}

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

const BooleanRadioFilter = (props: Props) => {

    const filtersState = useContext(FiltersContext)
    const {translationsProps, darkMode} = props
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

    const handleChange = (index: string, status:string) => {
        let _preventArray = filtersState.filtersState[props.filter.name]["main"]
        _preventArray["value"][index].status = status
        filtersState.changeMainFilter(props.filter.name, _preventArray)
    }

    // if(filtersPosition === "field"){
    //     return(
    //         <FieldContainer ref={node} onClick={() => {setOpen(true)}} darkMode={darkMode}>
    //             <label>{(!!filtersState.submitFiltersState && !!filtersState.submitFiltersState?.[props.filter.name]) ? filtersState.submitFiltersState?.[props.filter.name].main.value.map(filter => `${filter.label},${filter.status}`) : "Choisir"}</label>
    //             {open && 
    //                 <CheckContainer darkMode={darkMode}>
    //                     {filtersState.filtersState[props.filter.name]["main"]["value"].flatMap((radio,i) => {
    //                         return(
    //                             <div key={i}>
    //                                 <label>{radio.label}</label>
    //                                 <div style={{display: 'flex', paddingTop: 5}}>
    //                                     <label className="radio-container">
    //                                         <input type="radio" id={`radio_type_${radio.name}_YES`} name={`radio_type_${radio.name}_YES`} value="YES" checked={radio.status === "YES"} onChange={() => handleChange(i, "YES")}/>
    //                                         <span>{translationsProps?.yes ?? translations.yes}</span>
    //                                     </label>
    //                                     <label className="radio-container">
    //                                         <input type="radio" id={`radio_type_${radio.name}_NO`} name={`radio_type_${radio.name}_NO`} value="NO" checked={radio.status === "NO"} onChange={() => handleChange(i, "NO")}/>
    //                                         <span>{translationsProps?.no ?? translations.no}</span>
    //                                     </label>
    //                                     <label className="radio-container">
    //                                         <input type="radio" id={`radio_type_${radio.name}_NA`} name={`radio_type_${radio.name}_NA`} value="NA" checked={radio.status === "NA"} onChange={() => handleChange(i, "NA")}/>
    //                                         <span>{translationsProps?.na ?? translations.na}</span>
    //                                     </label>
    //                                 </div>
    //                             </div>
    //                         )
    //                     })}
    //                 </CheckContainer>
    //             }
    //         </FieldContainer>
    //     )
    // } else {
        return(
            <FilterContainer>
                <CheckContainer darkMode={darkMode}>
                    {filtersState.filtersState[props.filter.name]["main"]["value"].flatMap((radio,i) => {
                        return(
                            <div key={i}>
                                <label>{radio.label}</label>
                                <div style={{display: 'flex', paddingTop: 5}}>
                                    <label className="radio-container">
                                        <input type="radio" id={`radio_type_${radio.name}_YES`} name={`radio_type_${radio.name}_YES`} value="YES" checked={radio.status === "YES"} onChange={() => handleChange(i, "YES")}/>
                                        <span>{translationsProps?.yes ?? translations.yes}</span>
                                    </label>
                                    <label className="radio-container">
                                        <input type="radio" id={`radio_type_${radio.name}_NO`} name={`radio_type_${radio.name}_NO`} value="NO" checked={radio.status === "NO"} onChange={() => handleChange(i, "NO")}/>
                                        <span>{translationsProps?.no ?? translations.no}</span>
                                    </label>
                                    <label className="radio-container">
                                        <input type="radio" id={`radio_type_${radio.name}_NA`} name={`radio_type_${radio.name}_NA`} value="NA" checked={radio.status === "NA"} onChange={() => handleChange(i, "NA")}/>
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