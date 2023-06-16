import React, {useContext, useLayoutEffect, useState} from 'react'
import Select from 'react-select';
import _ from "lodash"
import FiltersContext from "../context/filterscontext"
import { FilterContainer } from '../assets/styled-components';
import { CommonInputFilterProps } from '../types/components-props';
import { FilterType } from '../types/entities';
import { translations } from '../assets/translations';

const CommonInputsFilter = (props: CommonInputFilterProps) => {

    const {
        filter, 
        translationsProps, 
        darkMode,
        type
    } = props

    const filtersState = useContext(FiltersContext)
    const [value, setValue] = useState<string>(filter.value)

    const optionsText = [
        {value:"contains", label:translationsProps?.filtersViewer?.contain ?? translations.filtersViewer.contain},
        {value:"equal", label:translationsProps?.filtersViewer?.equal ?? translations.filtersViewer.equal},
        {value:"startWith", label:translationsProps?.filtersViewer?.startWith ?? translations.filtersViewer.startWith},
        {value:"finishWith", label:translationsProps?.filtersViewer?.finishWith ?? translations.filtersViewer.finishWith},
    ]
    
    const optionsDate = [
        {value:"atDay", label:translationsProps?.filtersViewer?.atDay ?? translations.filtersViewer.atDay},
        {value:"minDay", label:translationsProps?.filtersViewer?.minDay ?? translations.filtersViewer.minDay},
        {value:"maxDay", label:translationsProps?.filtersViewer?.maxDay ?? translations.filtersViewer.maxDay},
    ]
    
    const optionsNumber = [
        {value:"equal", label:translationsProps?.filtersViewer?.equal ?? translations.filtersViewer.equal},
        {value:"moreThan", label:translationsProps?.filtersViewer?.moreThan ?? translations.filtersViewer.moreThan},
        {value:"lessThan", label:translationsProps?.filtersViewer?.lessThan ?? translations.filtersViewer.lessThan},
        {value:"between", label:translationsProps?.filtersViewer?.between ?? translations.filtersViewer.between},
    ]

    useLayoutEffect(() => {
        setValue(filter.value)
    }, [filter])

    function getOptionsArrayByType(type: FilterType): any[]{
        return type === "text" ? optionsText : type === "date" ? optionsDate : optionsNumber
    }

    const handleChange = ({currentTarget}) => {
        const {value} = currentTarget
        // @ts-ignore
        filtersState.changeFilter(filter.name, filter.id, {
            option: filter.option,
            value:value 
        })
    }
    
    const handleSelectChange = (e: {value:string, label:string}) => {
        // @ts-ignore
        filtersState.changeFilter(filter.name, filter.id, {
            value: filter.value,
            option: e.value 
        })
    }
    
    return(
        <FilterContainer darkMode={darkMode} filterParsedType={props.filterParsedType}>
            <div className="inputs">
                <Select 
                    options={getOptionsArrayByType(type)}
                    value={_.find(getOptionsArrayByType(type), {value: filter.option})}
                    onChange={handleSelectChange}
                    classNamePrefix="filterSelectChoice"/>
                <input 
                    autoFocus
                    name={filter.name} 
                    type={type}
                    value={value}
                    onChange={handleChange}
                    onKeyPress={(e) => e.key === "Enter" && props.onEnterPress()}/>
            </div>
        </FilterContainer>
    )
}

export default CommonInputsFilter