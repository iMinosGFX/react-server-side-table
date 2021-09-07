import React from 'react'
import styled  from 'styled-components';
import ItemFilter from './ItemFilter';
import _ from "lodash";
import { filtersType} from './ServerSideTable';
import FiltersContext from './context/filterscontext';
import { Translations } from './types/props';
import {translations} from "./assets/translations"

export type FilterItem = {
    name: string, 
    label: string, 
    type: "text" | "number" | "date" | "checkbox" | "booleanRadio" | "geoloc", 
    checkboxValues?: {value: string, label:string}[],
    radioValues?: {value:string, label:string}[],
    defaultOpen?:boolean
}

type Props = {
    filters?: FilterItem[]
    onSubmit(e: any): void
    filterParsedType: filtersType
    translationsProps?: Translations
}

const Container = styled.div`
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


const FiltersInteract = (props: Props) => {

    const {filters, translationsProps} = props

    return(
        <FiltersContext.Consumer>
            {filterContext => (
            <Container >
                {/* @ts-ignore */}
                {filters.map(filter => (
                    <ItemFilter 
                        key={filter.name} 
                        filter={filter} 
                        filterParsedType={props.filterParsedType}
                        translationsProps={translationsProps}/>
                ))}
                <div style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                    <span className="primary" onClick={() => filterContext.onClearAll()} style={{padding: '0px 10px', margin:'0px 10px', cursor: 'pointer'}}>
                        {translationsProps?.clearAll ?? translations.clearAll}
                    </span>
                </div>
            </Container>
            )}
        </FiltersContext.Consumer>
    )
}

export default FiltersInteract