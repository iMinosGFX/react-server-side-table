import React, {useState, useContext, useEffect} from 'react'
import styled  from 'styled-components';
import ItemFilter from './ItemFilter';
import _ from "lodash";
import {FiltersContext, filtersType} from "./ServerSideTable"

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

    const {filters} = props
    const filtersState = useContext(FiltersContext)

    return(
        <Container >
            {/* @ts-ignore */}
            {filters.map(filter => (
                <ItemFilter 
                    key={filter.name} 
                    filter={filter} 
                    filterParsedType={props.filterParsedType}/>
            ))}
            <div style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                <span className="primary" onClick={() => filtersState.onClearAll()} style={{padding: '0px 10px', margin:'0px 10px', cursor: 'pointer'}}>Effacer tout</span>
            </div>
        </Container>
    )
}

export default FiltersInteract