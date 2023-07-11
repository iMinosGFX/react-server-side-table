import React, { useContext } from 'react'
import _ from "lodash";
import FiltersContext from "../context/filterscontext"
import styled from 'styled-components';
import {translations} from "../assets/translations"
import { Translations } from '../types/props';
import { transparentize } from 'polished';
import { FiltersViewersProps } from '../types/components-props';
import { NewFilterItem } from '../types/entities';
import { newParseFilterRSQL } from '../newParserRSQL';

const Container = styled('div')<{darkMode: boolean}>`
    width: 100%;
    border-radius: 3px 3px 0 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    /* padding: 0 10px;  */
    box-sizing: border-box;
    span{
        line-height: 40px;
        color: ${props => props.darkMode ? "#e6e6e6" : "#435F71"};
    }
    .filters-label{
        background: ${transparentize(.8, "#2F80ED")};
        padding: 4px 6px;
        margin: auto 5px;
        border-radius: 5px;
        height: 33px;
        font-size: 12px;
        display: flex;
        align-items: center;
        span{
            line-height: 33px;
            color: #2F80ED;
            &:nth-of-type(1){ padding-right: 3px;}
            &:nth-of-type(2){padding-right: 6px; }
        }
        i{
            font-size: 14px;
            color: #2F80ED;
        }
        &.locked-label{
            background: ${transparentize(.8, "#435F71")};
            span{
                color: #435F71;
            }
        }
    }
    @media (max-width: 540px){
        display: none !important;
    }
`

const FiltersViewers: React.FC<FiltersViewersProps> = (props) => {

    const {translationsProps, darkMode, lockedFilters} = props

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

    const clearFilter = (filter: NewFilterItem, index?:number, clearRadio?:boolean) => {
        filtersState.onClearFilter(filter.name, filter.id, index, clearRadio)
    }

    const clearGeoloc = (filter: NewFilterItem) => {
  
        filtersState.onClickApply()
    }

    return(
        <>
            {newParseFilterRSQL(filtersState.newSubmitFilterState).length > 0 ?
                <Container darkMode={darkMode}>
                    {!!filtersState.newSubmitFilterState.length &&
                        filtersState.newSubmitFilterState
                        .sort((f1, f2) => f1.hasOwnProperty("locked") ? -1 : f2.hasOwnProperty("locked") ? 1 : 0)
                        .flatMap((filter, i) => {
                            let _array = []
                            if(["text", "number", "date"].includes(filter.type)){
                                if(!!filter.value){
                                    let _isLocked = filter?.locked
                                    _array.push(
                                        <div className={`filters-label ${_isLocked ? "locked-label" : ""}`} key={i}>
                                            <span>{filter.label}:</span> 
                                            <span className="font-italic font-light"> {translateOption(filter.option)} </span> 
                                            <span className="font-heavy">{Array.isArray(filter?.value) ? filter.value.join(",") : filter?.parsedValue ?? filter.value}</span>
                                            {!_isLocked && <i className="ri-close-line" style={{marginLeft: 5, cursor: "pointer", transform: "translateY(1px)"}} onClick={() => clearFilter(filter, i)}/>}
                                        </div>
                                    )
                                }
                            } else if (["checkbox", "checkboxCtn","checkboxCtnIntegers", "checkboxCtnStrings"].includes(filter.type)) {
                                if(!!filter.value && filter.value.length > 0)
                                    _array.push(
                                        <div className="filters-label" key={i}>
                                            <span>{filter.label}:</span> 
                                            <span className="font-heavy">
                                                {/* @ts-ignore */}
                                                {filter.value.map(v => filter.optionsValues.filter(ov => ov.value === v)?.[0]?.label).join()}
                                            </span>
                                            <i className="ri-close-line" style={{marginLeft: 5, cursor: "pointer"}} onClick={() => clearFilter(filter)}/>
                                        </div>
                                    )
                                } else if(filter.type === "booleanRadio") { //Render of booleanRadio
                                {/* @ts-ignore */}
                                if(filter.value !== "NA"){
                                    _array.push(
                                        <div className="filters-label" key={i}>
                                            <span>{filter.label}:</span> 
                                            <span className="font-italic font-light">{filter.optionsValues[0].label} </span>
                                            <span className="font-heavy"> {filter.value === "NO" ? "Non" : "Oui"}</span>
                                            <i className="ri-close-line" style={{marginLeft: 5, cursor: "pointer"}} onClick={() => clearFilter(filter, null, true)}/>
                                        </div>
                                    )
                                }
                            } else { //Render of GeolocFilter
                                if(filter.value["lat"] !== 0 && filter.value["lng"] !== 0){
                                    _array.push(
                                        <div className="filters-label" key={"geoloc_filter"}>
                                            <span>{filter.label}:</span> 
                                            <span className="font-italic font-light"> {filter.option}{translationsProps?.filtersViewer?.kmAroundOf ?? translations.filtersViewer.kmAroundOf}</span>
                                            <span className="font-heavy"> {filter.value["display"]} </span>
                                            <i className="ri-close-line" style={{marginLeft: 5, cursor: "pointer"}} onClick={() => clearGeoloc(filter)}/>
                                        </div>
                                    )
                                }
                            }
                            return _array
                        })
                    }
                    <button className="btn btn-outline-medium btn-sm" onClick={() => filtersState.onClearAll()} style={{margin:'0px 10px', cursor: 'pointer'}}>
                        <i className='ri-delete-bin-2-line'/>
                    </button>
                </Container>
                :  <></>
            }
        </>
    )
}

export default FiltersViewers