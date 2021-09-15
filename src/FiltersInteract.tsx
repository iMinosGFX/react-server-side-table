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
        box-shadow:
        0 0px 1.1px rgba(0, 0, 0, 0.043),
        0 0px 2.8px rgba(0, 0, 0, 0.062),
        0 0px 5.7px rgba(0, 0, 0, 0.078),
        0 0px 11.7px rgba(0, 0, 0, 0.097),
        0 0px 32px rgba(0, 0, 0, 0.14);
        cursor: pointer;
        background: ${props => props.darkMode ? "#141b24" : "#fff"};
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
                    <ListContainer>
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
                <SectionFilters>
                    {isMobile && <p onClick={() => setIsFilterOpen(!isFilterOpen)}>Filtres {isFilterOpen ? <BiChevronUp /> : <BiChevronDown />}</p>}
                    {isFilterOpen && 
                        <>
                        <FieldContainer>
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
                        <SearchContainer darkMode={darkMode}>
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