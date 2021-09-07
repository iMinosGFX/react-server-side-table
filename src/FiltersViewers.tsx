import React, { useContext } from 'react'
import _ from "lodash";
import FiltersContext from "./context/filterscontext"
import styled from 'styled-components';
import {translations} from "./assets/translations"
import { Translations } from './types/props';
import { FaTimes } from 'react-icons/fa';

const Container = styled.div`
    height: 60px;
    width: 100%;
    border-radius: 3px 3px 0 0;
    display: flex;
    padding: 0 10px;
    box-sizing: border-box;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    span{
        line-height: 60px;
        color: #435F71;
    }
    .filters-label{
        background: rgba(33, 106, 154, .2);
        color: #216A9A;
        padding: 0px 8px;
        margin: auto 5px;
        border-radius: 20px;
        height: 25px;
        font-size: 12px;
        span{
            line-height: 25px;
        }
        svg{
            color: #216A9A;
        }
    }
`

type Props = {
    translationsProps?: Translations
}


const FiltersViewers: React.FC<Props> = (props) => {

    const {translationsProps} = props

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
            {!!filtersState.submitFiltersState && !_.isEmpty(filtersState.submitFiltersState) ?
                <Container>
                    <span className="main">{translationsProps?.appliedFilters ?? translations.appliedFilters}</span>
                    {!!filtersState.submitFiltersState && Object.entries(filtersState.submitFiltersState).flatMap(([key, value], i) => { //Render of all not boolean / geoloc
                        let _array = []
                        if(value["type"] !== "booleanRadio" && value["type"] !== "geoloc"){
                            if(!!value["main"].value && value["main"].value !== ""){
                                _array.push(
                                    <div className="filters-label" key={i}>
                                        <span>{value["label"]}</span> : 
                                        <span className="font-italic font-light"> {translateOption(value["main"]["option"])} </span> 
                                        <span className="font-heavy"> {Array.isArray(value["main"]["value"]) ? value["main"]["value"].join(",") : value["main"]["value"]}</span>
                                        <FaTimes style={{marginLeft: 5, cursor: "pointer"}} onClick={() => clearMain(key)}/>
                                    </div>
                                )
                            }
                            Object.entries(value["optionals"]).map(([keyOption, valueOptions], i) => {
                                if(!!value["optionals"][keyOption]["value"] && value["optionals"][keyOption]["value"] !==""){
                                    _array.push(
                                        <div className="filters-label" key={i}>
                                            <span>{value["label"]}</span> : 
                                            <span className="font-italic font-light"> {translateOption(value["optionals"][keyOption]["option"])}</span> 
                                            <span className="font-heavy"> {value["optionals"][keyOption]["value"]}</span>
                                            <FaTimes style={{marginLeft: 5, cursor: "pointer"}} onClick={() => clearOptional(key, i)}/>
                                        </div>
                                    )
                                }
                            })
                        } else if(value["type"] === "booleanRadio") { //Render of booleanRadio
                            value["main"]["value"].map((radio,i) => {
                                if(radio.status !== "NA"){
                                    _array.push(
                                        <div className="filters-label" key={i}>
                                            <span>{value["label"]}</span> : 
                                            <span className="font-italic font-light">{radio.label} </span>
                                            <span className="font-heavy"> {radio.status === "NO" ? "Non" : "Oui"}</span>
                                            <FaTimes style={{marginLeft: 5, cursor: "pointer"}} onClick={() => clearRadio(key, i)}/>
                                        </div>
                                    )
                                }
                            }) 
                        } else { //Render of GeolocFilter
                            if(value["main"]["value"]["lat"] !== 0 && value["main"]["value"]["lng"] !== 0){
                                _array.push(
                                    <div className="filters-label" key={"geoloc_filter"}>
                                        <span>{value["label"]}</span> : 
                                        <span className="font-italic font-light"> {value["main"]["option"]}{translationsProps?.filtersViewer?.kmAroundOf ?? translations.filtersViewer.kmAroundOf}</span>
                                        <span className="font-heavy"> {value["main"]["value"]["display"]} </span>
                                        <FaTimes style={{marginLeft: 5, cursor: "pointer"}} onClick={() => clearGeoloc(key)}/>
                                    </div>
                                )
                            }
                        }
                        return _array
                    })}
                </Container>
                :  <></>
            }
        </>
    )
}

export default FiltersViewers