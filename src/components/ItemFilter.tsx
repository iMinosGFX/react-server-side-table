import React, {useRef, useContext, useState, useLayoutEffect} from 'react'
import CheckboxFilter from '../filters/CheckboxFilter';
import _ from "lodash"
import BooleanRadioFilter from '../filters/BooleanRadioFilter';
import FiltersContext from "../context/filterscontext"
import { Translations } from '../types/props';
import { translations } from '../assets/translations';
import { ListItem } from '../assets/styled-components';
import { FilterType, NewFilterItem } from '../types/entities';
import CommonInputsFilter from '../filters/CommonInputsFilter';

type Props = {
    // filter: FilterItem
    filterName: string
    filterType: FilterType
    ref?: any
    translationsProps?: Translations
    darkMode: boolean
    isOnRightOfViewport?: boolean
    onClose?():void
}

function getOptionsByType(type: string): string{
    switch(type){
        case 'text':
            return 'contains'
        case 'number':
            return 'equal'
        case 'date':
            return 'atDay'
    }
}

const ItemFilter = (props: Props) => {

    const {
        filterName,
        filterType,
        translationsProps,
        darkMode,
        isOnRightOfViewport,
        onClose,

    } = props

    const node = useRef()
    const filtersState = useContext(FiltersContext)
    const [filters, setFilters] = useState<NewFilterItem[]>(filtersState.newFilterState.filter(f => f.name === filterName))

    useLayoutEffect(() => {
        setFilters(filtersState.newFilterState.filter(f => f.name === filterName))
    }, [filtersState])

    const handleClear = (filterId: number) => {
        filtersState.onClearFilter(filterName, filterId)
        onClose()
    }

    const handleAddFilters = () => {
        filtersState.onAddFilter(filterName)
    }

    const handleRemoveFilter = (filter: NewFilterItem) => {
        let _currentFilters = [...filtersState.newFilterState]
            _.remove(_currentFilters, {id: filter.id, name: filter.name})
        filtersState.syncNewStateFilters(_currentFilters)
    }

    const handleClearCheckboxFilter = () => {
        filtersState.onClearFilter(filterName, filters[0].id)
        onClose()
    }

    const handleClearRadioFilter = () => {
        filtersState.onClearFilter(filterName, filters[0].id, null, true)
        onClose()
    }

    const handleClearGeolocFilter = () => {
        // filtersState.changeMainFilter(newFilter.name, {option: "1", value: {lat: 0, lng: 0, display:""}})
        filtersState.onClickApply()
    }

    function FilterRender(filter: NewFilterItem) {
        switch(filter.type){
            case 'text': case 'number': case 'date': 
                return(
                    <CommonInputsFilter 
                        filter={filter} 
                        id={filter.id} 
                        onEnterPress={() => {filtersState.onClickApply(); onClose()}}
                        filterParsedType={"rsql"} 
                        type={filter.type}
                        translationsProps={translationsProps}
                        darkMode={darkMode}/>
                )
            case 'checkbox': case 'checkboxCtn': case 'checkboxCtnIntegers': case 'checkboxCtnStrings': 
                return(
                    <CheckboxFilter 
                        filter={filter}
                        darkMode={darkMode}/>
                )
            case 'booleanRadio':
                return(
                    <BooleanRadioFilter 
                        filter={filter}
                        translationsProps={translationsProps}
                        darkMode={darkMode}/>
                )
        }
    }

    return(
        <ListItem ref={node} className="SST_list_filter_item" filterParsedType={"rsql"} isOnRightOfViewport={isOnRightOfViewport}>
                <div className="filterPopup SST_list_filter_item_popup">

                    {filters.map((filter, i) => (
                        <>
                            {(i !== 0 && ["text", "date", "number"].includes(filterType)) && <span className="addFilter">{translationsProps?.and ?? translations.and} <span onClick={() => handleRemoveFilter(filter)}>-</span></span>}
                            {FilterRender(filter)}
                            {["text", "date", "number"].includes(filterType) && <span className="addFilter" onClick={handleAddFilters}>+</span>}
                        </>
                    ))}

                    <div style={{display: "flex", justifyContent: 'right', alignItems: 'center', margin: "auto", paddingTop: 5, fontSize: 14}}>
                        <span 
                            className="primary" 
                            onClick={() => {
                                if(["checkbox","checkboxCtn","checkboxCtnIntegers", "checkboxCtnStrings"].includes(filterType)){
                                    handleClearCheckboxFilter()
                                    return
                                }
                                if(filterType === "booleanRadio"){
                                    handleClearRadioFilter()
                                    return
                                }
                                if(filterType === "geoloc"){
                                    handleClearGeolocFilter()
                                    return
                                }
                                handleClear(filters?.[0].id)
                            }} 
                            style={{padding: '0px 10px', margin:'0px 10px', cursor: 'pointer'}}>
                                {translationsProps?.clear ?? translations.clear}
                        </span>
                        <button className="btn align bg-primary light validBtn" onClick={() => {filtersState.onClickApply(); onClose()}}>{translationsProps?.apply ?? translations.apply}</button>
                    </div>
                </div>
        </ListItem>
    )
}

export default ItemFilter