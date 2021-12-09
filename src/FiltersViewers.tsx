import React, { useContext } from 'react'
import _ from "lodash";
import FiltersContext from "./context/filterscontext"
import styled from 'styled-components';
import {translations} from "./assets/translations"
import { Translations } from './types/props';
import { parseFilterRSQL } from './parserRSQL';
import { parseFilterFuzzy } from './parserFuzzy';
import { transparentize } from 'polished';

const Container = styled('div')<{darkMode: boolean}>`
    height: 60px;
    width: 100%;
    border-radius: 3px 3px 0 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    span{
        line-height: 60px;
        color: ${props => props.darkMode ? "#e6e6e6" : "#435F71"};
    }
    .filters-label{
        background: ${transparentize(.8, "#2F80ED")};
        padding: 0px 8px;
        margin: auto 5px;
        border-radius: 5px;
        height: 25px;
        font-size: 12px;
        display: flex;
        align-items: center;
        span{
            line-height: 25px;
            color: #2F80ED;
            &:nth-of-type(1){ padding-right: 3px;}
            &:nth-of-type(2){padding-right: 6px; }
        }
        i{
            font-size: 14px;
            color: #2F80ED;
        }
    }
    @media (max-width: 540px){
        display: none !important;
    }
`

type Props = {
    translationsProps?: Translations
    darkMode: boolean
}


const FiltersViewers: React.FC<Props> = (props) => {

    const {translationsProps, darkMode} = props

    function translateOption(opt: string): string{
        switch(opt){
            case 'contains':
                return translationsProps?.filtersViewer?.contain ?? translations.filtersViewer.contain
            case 'startWith' :
                return translationsProps?.filtersViewer?.startWith ?? translations.filtersViewer.startWith
            case 'finishWith' :
                return translationsProps?.filtersViewer?.finishWith ?? translations.filtersViewer.finishWith
            case 'equal' :
                return translationsProps?.filtersViewer?.equal ?? translations.filtersViewer.equal
            case 'moreThan' :
                return translationsProps?.filtersViewer?.moreThan ?? translations.filtersViewer.moreThan
            case 'lessThan' :
                return translationsProps?.filtersViewer?.lessThan ?? translations.filtersViewer.lessThan
            case 'between' :
                return translationsProps?.filtersViewer?.between ?? translations.filtersViewer.between
            case 'atDay' :
                return translationsProps?.filtersViewer?.atDay ?? translations.filtersViewer.atDay
            case 'minDay' :
                return translationsProps?.filtersViewer?.minDay ?? translations.filtersViewer.minDay
            case 'maxDay' :
                return translationsProps?.filtersViewer?.maxDay ?? translations.filtersViewer.maxDay
            default:
                return opt
        }
    }

    const filtersState = useContext(FiltersContext)

    const clearMain = (name:string) => {
        let _filter = filtersState.filtersState[name]
        _filter["main"].value = ""
        filtersState.changeMainFilter(name, {option: filtersState.filtersState[name]["main"].option, value:""})
        filtersState.onClickApply()
    }

    const clearOptional = (name:string, index:any) => {
        if(filtersState.filtersState[name]["optionals"].length === 1){
            filtersState.changeOptionalsFilters(name, [])
            return;
        }
        let _filtersArray = filtersState.filtersState[name]["optionals"]
        _filtersArray.splice(index, 1)
        filtersState.changeOptionalsFilters(name, _filtersArray)
        filtersState.onClickApply()
    }
    
    const clearRadio = (name:string, index: number) => {
        let _preventArray = filtersState.filtersState[name]["main"]
        _preventArray["value"][index].status = "NA"
        filtersState.changeMainFilter(name, _preventArray)
        filtersState.onClickApply()
    }

    const clearGeoloc = (name:string) => {
        let _preventArray = filtersState.filtersState[name]["main"]
        _preventArray["option"] = ""
        _preventArray["value"] = {lat: 0, lng: 0, display:""}
        filtersState.changeMainFilter(name, _preventArray)
        filtersState.onClickApply()
    }

    return(
        <>
            {parseFilterRSQL(filtersState.submitFiltersState).length > 0 &&  !_.isEmpty(parseFilterFuzzy(filtersState.submitFiltersState)) ?
                <Container darkMode={darkMode}>
                    <span className="main">{translationsProps?.appliedFilters ?? translations.appliedFilters}</span>
                    {!!filtersState.submitFiltersState && Object.entries(filtersState.submitFiltersState).flatMap(([key, value], i) => { //Render of all not boolean / geoloc
                        let _array = []
                        if(value["type"] !== "booleanRadio" && value["type"] !== "geoloc"){
                            if(!!value["main"].value && value["main"].value !== ""){
                                _array.push(
                                    <div className="filters-label" key={i}>
                                        <span>{value["label"]}:</span> 
                                        <span className="font-italic font-light"> {translateOption(value["main"]["option"])} </span> 
                                        <span className="font-heavy"> {Array.isArray(value["main"]["value"]) ? value["main"]["value"].join(",") : value["main"]["value"]}</span>
                                        <i className="ri-close-line" style={{marginLeft: 5, cursor: "pointer", transform: "translateY(1px)"}} onClick={() => clearMain(key)}/>
                                    </div>
                                )
                            }
                            Object.entries(value["optionals"]).map(([keyOption, valueOptions], i) => {
                                if(!!value["optionals"][keyOption]["value"] && value["optionals"][keyOption]["value"] !==""){
                                    _array.push(
                                        <div className="filters-label" key={i}>
                                            <span>{value["label"]}:</span>
                                            <span className="font-italic font-light"> {translateOption(value["optionals"][keyOption]["option"])}</span> 
                                            <span className="font-heavy"> {value["optionals"][keyOption]["value"]}</span>
                                            <i className="ri-close-line" style={{marginLeft: 5, cursor: "pointer", transform: "translateY(1px)"}} onClick={() => clearOptional(key, i)}/>
                                        </div>
                                    )
                                }
                            })
                        } else if(value["type"] === "booleanRadio") { //Render of booleanRadio
                            value["main"]["value"].map((radio,i) => {
                                if(radio.status !== "NA"){
                                    _array.push(
                                        <div className="filters-label" key={i}>
                                            <span>{value["label"]}:</span> 
                                            <span className="font-italic font-light">{radio.label} </span>
                                            <span className="font-heavy"> {radio.status === "NO" ? "Non" : "Oui"}</span>
                                            <i className="ri-close-line" style={{marginLeft: 5, cursor: "pointer"}} onClick={() => clearRadio(key, i)}/>
                                        </div>
                                    )
                                }
                            }) 
                        } else { //Render of GeolocFilter
                            if(value["main"]["value"]["lat"] !== 0 && value["main"]["value"]["lng"] !== 0){
                                _array.push(
                                    <div className="filters-label" key={"geoloc_filter"}>
                                        <span>{value["label"]}:</span> 
                                        <span className="font-italic font-light"> {value["main"]["option"]}{translationsProps?.filtersViewer?.kmAroundOf ?? translations.filtersViewer.kmAroundOf}</span>
                                        <span className="font-heavy"> {value["main"]["value"]["display"]} </span>
                                        <i className="ri-close-line" style={{marginLeft: 5, cursor: "pointer"}} onClick={() => clearGeoloc(key)}/>
                                    </div>
                                )
                            }
                        }
                        return _array
                    })}
                    <div style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                        <span className="primary" onClick={() => filtersState.onClearAll()} style={{padding: '0px 10px', margin:'0px 10px', cursor: 'pointer'}}>
                            {translationsProps?.clearAll ?? translations.clearAll}
                        </span>
                    </div>
                </Container>
                :  <></>
            }
        </>
    )
}

export default FiltersViewers