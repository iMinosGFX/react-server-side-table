import React, {useContext} from 'react'
import { FilterItem } from '../FiltersInteract';
import styled  from 'styled-components';
import Select from 'react-select';
import _ from "lodash"
import {FiltersContext, filtersType} from "../ServerSideTable"

type Props = {
    filter: FilterItem
    onEnterPress(): void
    index: "main" | number
    filterParsedType: filtersType
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
        input[type='number']{
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

const options = [
    {value:"equal", label:"Égal à"},
    {value:"moreThan", label:"Supérieur à"},
    {value:"lessThan", label:"Inférieur à"},
    {value:"between", label:`Entre (séparateur -)`},
]

const TextFilter = (props: Props) => {

    const {filter, index} = props
    const filtersState = useContext(FiltersContext)
    
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
                        : <span style={{lineHeight: "2.4rem", color: "#435F71"}}>Égal a</span> 
                    }
                <input 
                    name={filter.name} 
                    type="number"
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