import React, {useState, useEffect, useRef, useContext} from 'react'
import { FilterItem } from './FiltersInteract';
import TextFilter from './filters/TextFilter';
import NumberFilter from './filters/NumberFilter';
import CheckboxFilter from './filters/CheckboxFilter';
import DateFilter from './filters/DateFilter';
import _ from "lodash"
import BooleanRadioFilter from './filters/BooleanRadioFilter';
import FiltersContext from "./context/filterscontext"
import { Translations } from './types/props';
import { translations } from './assets/translations';
import { FieldItem, ListItem } from './assets/styled-components';
import { filtersType } from './types/entities';

type Props = {
    filter: FilterItem
    ref?: any
    filterParsedType: filtersType
    translationsProps?: Translations
    darkMode: boolean
    isOnRightOfViewport?: boolean
    isField?: boolean
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

    const node = useRef()
    const filtersState = useContext(FiltersContext)
    const {translationsProps, darkMode, isOnRightOfViewport} = props
  
    const handleClear = () => {
        filtersState.changeMainFilter(props.filter.name, {option: getOptionsByType(props.filter.type), value:""})
        filtersState.changeOptionalsFilters(props.filter.name, [])
        filtersState.onClickApply()
    }

    const handleAddFilters = () => {
        filtersState.changeOptionalsFilters(props.filter.name, [
            ...filtersState.filtersState[props.filter.name]["optionals"],
            {option:getOptionsByType(props.filter.type), value:""}
        ])
    }

    const handleRemoveOptionalFilter = (index: number) => {
        if(filtersState.filtersState[props.filter.name]["optionals"].length === 1){
            filtersState.changeOptionalsFilters(props.filter.name, [])
            return;
        }
        let _filtersArray = filtersState.filtersState[props.filter.name]["optionals"]
        _filtersArray.splice(index, 1)
        filtersState.changeOptionalsFilters(props.filter.name, _filtersArray)
    }

    const handleClearCheckboxFilter = () => {
        filtersState.changeMainFilter(props.filter.name, {option: getOptionsByType(props.filter.type), value:""})
        filtersState.onClickApply()
    }

    const handleClearRadioFilter = () => {
        filtersState.changeMainFilter(props.filter.name, {option: "", value: props.filter.radioValues.map(value => ({name: value.value, status: "NA", label: value.label}))})
        filtersState.onClickApply()
    }

    const handleClearGeolocFilter = () => {
        filtersState.changeMainFilter(props.filter.name, {option: "1", value: {lat: 0, lng: 0, display:""}})
        filtersState.onClickApply()
    }

    function FilterRender(filter: FilterItem, index: "main" | number) {
        switch(filter.type){
            case 'text': 
                return(
                    <TextFilter 
                        filter={filter} 
                        index={index === "main" ? "main" : index} 
                        onEnterPress={() => filtersState.onClickApply()}
                        filterParsedType={props.filterParsedType} 
                        translationsProps={translationsProps}
                        darkMode={darkMode}/>
                )
            case 'number':
                return(
                    <NumberFilter 
                        filter={filter} 
                        index={index === "main" ? "main" : index} 
                        onEnterPress={() => filtersState.onClickApply()}
                        filterParsedType={props.filterParsedType}
                        translationsProps={translationsProps}
                        darkMode={darkMode}/>
                )
            case 'date': 
                return(
                    <DateFilter
                        filter={filter} 
                        index={index === "main" ? "main" : index} 
                        onEnterPress={() => filtersState.onClickApply()}
                        filterParsedType={props.filterParsedType}
                        translationsProps={translationsProps}
                        darkMode={darkMode}/>
                    )
            case 'checkbox':
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

    if(!!props.isField){
        return(
                <>
                <FieldItem className="SST_field_filter_item">
                    <label>{props.filter.label} {props.filter.type !== "checkbox" && props.filter.type !== "booleanRadio" && props.filterParsedType === "rsql" && <span className="addFilter" style={{cursor: "pointer"}} onClick={handleAddFilters}>+</span>}</label>
                    {FilterRender(props.filter, "main")}
                </FieldItem>
                {filtersState.filtersState[props.filter.name].optionals.map((optional, i) => (
                    <FieldItem key={i} className="SST_field_filter_item SST_field_filter_optional_item">
                        <label>{props.filter.label} <span style={{cursor: "pointer"}} onClick={() => handleRemoveOptionalFilter(i)}>-</span></label>
                        {FilterRender(props.filter, i)}
                    </FieldItem>
                ))}
                </>
            )
        } else {
            return(
                <ListItem ref={node} className="SST_list_filter_item" filterParsedType={props.filterParsedType} isOnRightOfViewport={isOnRightOfViewport}>

                        <div className="filterPopup SST_list_filter_item_popup">
                            {FilterRender(props.filter, "main")}
                            {filtersState.filtersState[props.filter.name].optionals.map((optional, i) => (
                                <React.Fragment key={i}>
                                    <span className="addFilter">{translationsProps?.and ?? translations.and} <span onClick={() => handleRemoveOptionalFilter(i)}>-</span></span>
                                    {FilterRender(props.filter, i)}
                                </React.Fragment>
                            ))}
        
                            {props.filter.type !== "checkbox" && props.filter.type !== "booleanRadio" && props.filterParsedType === "rsql" && <span className="addFilter" onClick={handleAddFilters}>+</span>}
                            
                            <div style={{display: "flex", justifyContent: 'right', alignItems: 'center', margin: "auto", paddingTop: 5, fontSize: 14}}>
                                <span 
                                    className="primary" 
                                    onClick={() => props.filter.type === "checkbox" ? handleClearCheckboxFilter() : props.filter.type === "booleanRadio" ? handleClearRadioFilter() : props.filter.type === "geoloc" ? handleClearGeolocFilter() : handleClear()}  
                                    style={{padding: '0px 10px', margin:'0px 10px', cursor: 'pointer'}}>
                                        {translationsProps?.clear ?? translations.clear}
                                </span>
                                <button className="btn align bg-primary light validBtn" onClick={() => filtersState.onClickApply()}>{translationsProps?.apply ?? translations.apply}</button>
                            </div>
                        </div>
                </ListItem>
            )
        }
}

export default ItemFilter