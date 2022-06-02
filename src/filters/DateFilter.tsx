import React, {useContext} from 'react'
import Select from 'react-select';
import _ from "lodash"
import FiltersContext from "../context/filterscontext"
import { translations } from '../assets/translations';
import { FilterContainer } from '../assets/styled-components';
import { TextFilterProps } from '../types/components-props';

const DateFilter = (props: TextFilterProps) => {

    const {filter, index, translationsProps, darkMode} = props
    const filtersState = useContext(FiltersContext)

    const options = [
        {value:"atDay", label:translationsProps?.filtersViewer?.atDay ?? translations.filtersViewer.atDay},
        {value:"minDay", label:translationsProps?.filtersViewer?.minDay ?? translations.filtersViewer.minDay},
        {value:"maxDay", label:translationsProps?.filtersViewer?.maxDay ?? translations.filtersViewer.maxDay},
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
                    <span style={{lineHeight: "2.4rem", color: "#435F71"}}>{translationsProps?.filtersViewer?.atDay ?? translations.filtersViewer.atDay}</span> 
                }
                <input 
                    autoFocus
                    name={filter.name} 
                    type="date"
                    value={index === "main"
                    ? filtersState.filtersState[filter.name]["main"].value
                    : filtersState.filtersState[filter.name]["optionals"][index].value}
                    onChange={handleChange}
                    onKeyPress={(e) => e.key === "Enter" && props.onEnterPress()}/>
            </div>
        </FilterContainer>
    )
}

export default DateFilter