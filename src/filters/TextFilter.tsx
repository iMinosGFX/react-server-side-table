import React, {useContext} from 'react'
import { FilterItem } from '../FiltersInteract';
import styled  from 'styled-components';
import Select from 'react-select';
import _ from "lodash"
import {filtersType} from "../ServerSideTable"
import FiltersContext from "../context/filterscontext"
import { Translations } from '../types/props';
import { translations } from '../assets/translations';

type Props = {
    filter: FilterItem
    onEnterPress(): void
    index: "main" | number
    filterParsedType: filtersType
    translationsProps: Translations
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
    .inputs{
        display: block;
        input[type='text']{
            background: #fff;
            height: 35px;
            line-height: 35px;
            border: 1px solid #E0E0E0;
            width: 70%;
            padding-left: 5px;
            float: right;
            margin-bottom: 10px;
            color: #435F71 !important;
        }

        .filterSelectChoice__control{
            border: none;
            margin-bottom: 10px;
            border: 1px solid #E0E0E0;
        }
        .filterSelectChoice__input{
            input{
                height: 1.2rem !important;
                font-size: 15px !important;
            }
        }
    }
`

const TextFilter = (props: Props) => {

    const {filter, index, translationsProps} = props
    const filtersState = useContext(FiltersContext)

    const options = [
        {value:"contains", label:translationsProps?.filtersViewer?.contain ?? translations.filtersViewer.contain},
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
        <FilterContainer>
            <div className="inputs">
                {props.filterParsedType === "rsql" ? 
                    <Select 
                        options={options}
                        value={index === "main" 
                            ? _.find(options, {value: filtersState.filtersState[filter.name]["main"].option})
                            : _.find(options, {value: filtersState.filtersState[filter.name]["optionals"][index].option}) }
                        onChange={e => handleSelectChange(e)}
                        classNamePrefix="filterSelectChoice"/>
                    : <span style={{lineHeight: "2.4rem", color: "#435F71"}}>{translationsProps?.filtersViewer?.contain ?? translations.filtersViewer.contain}</span>
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