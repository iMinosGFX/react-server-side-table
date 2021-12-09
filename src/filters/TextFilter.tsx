import React, {useContext} from 'react'
import { FilterItem } from '../FiltersInteract';
import Select from 'react-select';
import _ from "lodash"
import {filtersType} from "../ServerSideTable"
import FiltersContext from "../context/filterscontext"
import { Translations } from '../types/props';
import { translations } from '../assets/translations';
import { FilterContainer } from '../assets/styled-components';

type Props = {
    filter: FilterItem
    onEnterPress(): void
    index: "main" | number
    filterParsedType: filtersType
    translationsProps: Translations
    darkMode: boolean
}

const TextFilter = (props: Props) => {

    const {filter, index, translationsProps, darkMode} = props
    const filtersState = useContext(FiltersContext)

    const options = [
        {value:"contains", label:translationsProps?.filtersViewer?.contain ?? translations.filtersViewer.contain},
        {value:"equal", label:translationsProps?.filtersViewer?.equal ?? translations.filtersViewer.equal},
        {value:"startWith", label:translationsProps?.filtersViewer?.startWith ?? translations.filtersViewer.startWith},
        {value:"finishWith", label:translationsProps?.filtersViewer?.finishWith ?? translations.filtersViewer.finishWith},
    ]

    const handleChange = ({currentTarget}) => {
        const {value} = currentTarget
        if(index === "main"){
            filtersState.changeMainFilter(filter.name, {
                option: filtersState.filtersState[filter.name]["main"].option,
                value:value 
            })
        } else {
            let _optionalsFilter = filtersState.filtersState[filter.name]["optionals"]
            _optionalsFilter[index].value = value
            filtersState.changeOptionalsFilters(filter.name, _optionalsFilter)
        }
    }

    const handleSelectChange = (e: {value:string, label:string}) => {
        if(index === "main"){
            filtersState.changeMainFilter(filter.name, {
                value: filtersState.filtersState[filter.name]["main"].value,
                option: e.value 
            })
        } else {
            let _optionalsFilter = filtersState.filtersState[filter.name]["optionals"]
            _optionalsFilter[index].option = e.value
            filtersState.changeOptionalsFilters(filter.name, _optionalsFilter)
        }
    }
    
    return(
        <FilterContainer darkMode={darkMode} filterParsedType={props.filterParsedType}>
            <div className="inputs">
                {props.filterParsedType === "rsql" ? 
                    <Select 
                        options={options}
                        value={index === "main" 
                            ? _.find(options, {value: filtersState.filtersState[filter.name]["main"].option})
                            : _.find(options, {value: filtersState.filtersState[filter.name]["optionals"][index].option}) }
                        onChange={e => handleSelectChange(e)}
                        classNamePrefix="filterSelectChoice"/>
                    : 
                    <span style={{lineHeight: "2.4rem", color: "#435F71"}}>{translationsProps?.filtersViewer?.contain ?? translations.filtersViewer.contain}</span>
                }
                <input 
                    name={filter.name} 
                    type="text"
                    value={index === "main"
                    ? filtersState.filtersState[filter.name]["main"].value
                    : filtersState.filtersState[filter.name]["optionals"][index].value}
                    onChange={handleChange}
                    onKeyPress={(e) => e.key === "Enter" && props.onEnterPress()}/>
            </div>
        </FilterContainer>
    )
}

export default TextFilter