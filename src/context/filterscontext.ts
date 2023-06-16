import React from 'react';
import { NewFilterItem, SorterRecord } from '../types/entities';

type Context = {
    filtersState: any,
    newFilterState: NewFilterItem[]
    newSubmitFilterState: NewFilterItem[]
    submitFiltersState: any,
    sorterState: any,
    changeFilter(name: string, id: number, content: {option:string, value:string | any}): void,
    onClearFilter(name: string, id: number, index?:number, clearRadio?:boolean): void,
    changeSort(e: SorterRecord): void,
    onClearAll(): void,
    onClickApply(): void,
    onAddFilter(filter: string): void
    syncNewStateFilters(filters: NewFilterItem[]): void
}

const FiltersContext = React.createContext<Context>({
    filtersState: {},
    newFilterState: [],
    newSubmitFilterState: [],
    submitFiltersState: null,
    sorterState: null,
    changeFilter: (name: string, id: number, content: {option:string, value:string | any}) => {},
    onClearFilter: (name: string, id: number) => {},
    changeSort: (e: SorterRecord) => {},
    onClearAll:() => {},
    onClickApply:() => {},
    onAddFilter: (filter: string) => {},
    syncNewStateFilters: (filters: NewFilterItem[]) => {}


})

export default FiltersContext;
