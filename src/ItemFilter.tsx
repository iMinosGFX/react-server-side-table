import React, {useState, useEffect, useRef, useContext} from 'react'
import { FilterItem } from './FiltersInteract';
import styled from 'styled-components';
import TextFilter from './filters/TextFilter';
import NumberFilter from './filters/NumberFilter';
import CheckboxFilter from './filters/CheckboxFilter';
import DateFilter from './filters/DateFilter';
import _ from "lodash"
import {FiltersContext, filtersType} from "./ServerSideTable";
import BooleanRadioFilter from './filters/BooleanRadioFilter';
import GeolocFilter from './filters/GeolocFilter';

type Props = {
    filter: FilterItem
    ref?: any
    filterParsedType: filtersType
}

const Item = styled("div")<any>`
    width: max-content;
    padding: 5px 10px;
    box-sizing: border-box;
    font-size: 15px;
    margin-bottom: 5px;
    margin: 1px 10px;
    border: ${props => props.type === "top" && "1px solid #E1E1E1"};
    border-radius: 2px;
    color: #798c97;
    transition: all 200ms ease;
    position: relative;
    /* background:${props => props.type === "top" && "#FFF"}; */
    &:after{
        color: #798c97;
        border-right: 1px solid currentcolor;
        border-bottom: 1px solid currentcolor;
        content: '';
        position: absolute;
        top: 10px;
        right: -5px;
        width: 6px;
        height: 6px;
        transform: rotate(45deg)
    }
    .filterName{
        cursor: pointer;
    }
    &:hover{
        background: ${props => props.type === "left" && "rgba(33, 106, 154,.1)"};
        /* border: ${props => props.type === "top" && "1px solid #216A9A"}; */
        color: #216A9A;
    }
    .filterPopup{
        width: 300px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        position: absolute;
        top: ${props => props.type === "left" ? "0px" : "110%"};
        left: ${props => props.type === "left" ? "105%" : "0"};
        z-index: 9999;
        padding: 10px;
        h4{
            font-weight: 400;
            color: #435F71 !important;
        }
    }
    .addFilter{
        clear: both;
        display: block;
        width: 40px;
        border: 1px solid #c8c8c8;
        background: #fff;
        color: #707070;
        border-radius: 2px;
        text-align: center;
        margin: 10px auto;
        position: relative;
        cursor: pointer;
        &:after{
            content:"";
            z-index: -1;
            width: 300px;
            height: 1px;
            background: #c8c8c8;
            position: absolute;
            display: block;
            top: 50%;
            left: -130px;
        }
    }
`


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

    const [open, setOpen] = useState<boolean>(false)
    const node = useRef()
    const filtersState = useContext(FiltersContext)

    /**
     * useRef pour remove sidebar info au clic exterieur
     */
    const handleClick = e => {
        //@ts-ignore
        if (node.current && node.current.contains(e.target)) {
            return;
        } else {
            setOpen(false)
        }
    };
    
    useEffect(() => {
        console.log(filtersState)
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

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
                        filterParsedType={props.filterParsedType} />
                )
            case 'number':
                return(
                    <NumberFilter 
                        filter={filter} 
                        index={index === "main" ? "main" : index} 
                        onEnterPress={() => filtersState.onClickApply()}
                        filterParsedType={props.filterParsedType} />
                )
            case 'date': 
                return(
                    <DateFilter
                        filter={filter} 
                        index={index === "main" ? "main" : index} 
                        onEnterPress={() => filtersState.onClickApply()}
                        filterParsedType={props.filterParsedType}/>
                    )
            case 'checkbox':
                return(
                    <CheckboxFilter 
                        filter={filter}/>
                )
            case 'booleanRadio':
                return(
                    <BooleanRadioFilter filter={filter}/>
                )
            case 'geoloc':
                return(
                    <GeolocFilter filter={filter}/>
                )
        }
    }

    return(
        <Item ref={node} onClick={() => {setOpen(true)}}>
            <span className="filterName">{props.filter.label}</span>
            {open && 
                <div className="filterPopup">
                    <h4>Filtre pour {props.filter.label}</h4>
                    {FilterRender(props.filter, "main")}
                    {filtersState.filtersState[props.filter.name].optionals.map((optional, i) => (
                        <React.Fragment key={i}>
                            <span className="addFilter">ET <span onClick={() => handleRemoveOptionalFilter(i)}>-</span></span>
                            {FilterRender(props.filter, i)}
                        </React.Fragment>
                    ))}

                    {props.filter.type !== "checkbox" && props.filter.type !== "booleanRadio" && props.filterParsedType === "rsql" && <span className="addFilter" onClick={handleAddFilters}>+</span>}
                    
                    <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', width: "inherit", margin: "auto", paddingTop: 5, fontSize: 14}}>
                        <span className="primary" onClick={() => props.filter.type === "checkbox" ? handleClearCheckboxFilter() : props.filter.type === "booleanRadio" ? handleClearRadioFilter() : props.filter.type === "geoloc" ? handleClearGeolocFilter() : handleClear()}  style={{padding: '0px 10px', margin:'0px 10px', cursor: 'pointer'}}>Effacer</span>
                        <button className="btn align bg-primary light validBtn" onClick={() => filtersState.onClickApply()}>Appliquer</button>
                    </div>
                </div>
            }
        </Item>
    )
}

export default ItemFilter