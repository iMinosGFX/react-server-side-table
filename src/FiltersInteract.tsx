import React, { useContext, useState } from 'react'
import styled  from 'styled-components';
import ItemFilter from './ItemFilter';
import _ from "lodash";
import { FiltersPosition, filtersType} from './ServerSideTable';
import FiltersContext from './context/filterscontext';
import { Translations } from './types/props';
import {translations} from "./assets/translations"
import { BiChevronDown, BiChevronUp, BiSearchAlt } from 'react-icons/bi';

export type FilterItem = {
    name: string, 
    label: string, 
    type: "text" | "number" | "date" | "checkbox" | "booleanRadio" | "geoloc", 
    checkboxValues?: {value: string, label:string}[],
    radioValues?: {value:string, label:string}[],
    defaultOpen?:boolean
    widthPercentage?: number
}

type Props = {
    filters?: FilterItem[]
    onSubmit(e: any): void
    filterParsedType: filtersType
    translationsProps?: Translations
    filtersPosition?: FiltersPosition
    darkMode: boolean
    isMobile?:boolean
}

const ListContainer = styled.div`
    display: flex;
    align-items: center;
    height: 60px;
    h3{
        font-weight: 400;
        color: #afafaf;
        padding-left: 5px;
        padding-top: 5px;
    }
    .validBtn{
        border-radius: 3px;
        padding: 6px 12px;
    }
    .clearBtn{
        border-radius: 3px;
        padding: 6px 12px;
        background-color: #eeeeee;
    }
    .popup{
        width: 200px;
        height: 200px;
        background: red;
    }
`

const SectionFilters = styled('div')`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    p{
        width: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    @media (max-width: 540px){
        flex-direction: column;
    }
`

const FieldContainer = styled('div')`
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    padding: 10px 0;
    @media (max-width: 540px){
        flex-direction: column;
        width: 100%;
    }
`

const SearchContainer = styled('div')<{darkMode: boolean}>`
    width: 10%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    label{
        display: none;
    }
    span{
        width: 30px;
        height: 30px;
        display: flex;
        cursor: pointer;
        background: ${props => props.darkMode ? "#141b24" : "#ececec"};
        border-radius: 20px;
        align-items: center;
        justify-content: center;
        svg{
            font-size: 20px;
        }
    }
    @media (max-width: 540px){
        width: 100%;
        padding: 10px 0; 
        span{
            width: fit-content;
            border-radius: 3px;
        }
        label{
            display: block;
            padding: 0 10px;
        }
    }
`


const FiltersInteract = (props: Props) => {

    const {filters, translationsProps, filtersPosition, darkMode, isMobile} = props

    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(!isMobile) 

    return(
        <FiltersContext.Consumer>
            {filterContext => (
                filtersPosition === "list" ? 
                    <ListContainer className="SST_list_filters_container">
                        {/* @ts-ignore */}
                        {filters.map(filter => (
                            <ItemFilter 
                                key={filter.name} 
                                filter={filter} 
                                filterParsedType={props.filterParsedType}
                                translationsProps={translationsProps}
                                filtersPosition={filtersPosition}
                                darkMode={darkMode}/>
                        ))}
                        <div style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                            <span className="primary" onClick={() => filterContext.onClearAll()} style={{padding: '0px 10px', margin:'0px 10px', cursor: 'pointer'}}>
                                {translationsProps?.clearAll ?? translations.clearAll}
                            </span>
                        </div>
                    </ListContainer>
                : 
                <SectionFilters className="SST_field_filters_container">
                    {isMobile && <p onClick={() => setIsFilterOpen(!isFilterOpen)}>Filtres {isFilterOpen ? <BiChevronUp /> : <BiChevronDown />}</p>}
                    {isFilterOpen && 
                        <>
                        <FieldContainer className="SST_field_filters">
                            {filters.map(filter => (
                                <ItemFilter 
                                    key={filter.name} 
                                    filter={filter} 
                                    filterParsedType={props.filterParsedType}
                                    translationsProps={translationsProps}
                                    filtersPosition={filtersPosition}
                                    darkMode={darkMode}/>
                            ))}
                        </FieldContainer>
                        <SearchContainer darkMode={darkMode} className="SST_submit_filters_btn">
                            <span onClick={() => filterContext.onClickApply()}> <BiSearchAlt /> <label>Rechercher</label></span>
                        </SearchContainer>
                        </>
                    }
                </SectionFilters>
            )}
        </FiltersContext.Consumer>
    )
}

export default FiltersInteract