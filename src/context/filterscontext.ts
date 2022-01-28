import React from 'react';
import { SorterRecord } from '../types/entities';

type Context = {
    filtersState: any,
    submitFiltersState: any,
    sorterState: any,
    changeMainFilter(name: string, content: {option:string, value:string | any}): void,
    changeOptionalsFilters(name: string, content: {option:string, value:string}[]): void,
    changeSort(e: SorterRecord): void,
    onClearAll(): void,
    onClickApply(): void,
}

const FiltersContext = React.createContext<Context>({
    filtersState: {},
    submitFiltersState: null,
    sorterState: null,
    changeMainFilter: (name: string, content: {option:string, value:string | any}) => {},
    changeOptionalsFilters: (name: string, content: {option:string, value:string}[]) => {},
    changeSort: (e: SorterRecord) => {},
    onClearAll:() => {},
    onClickApply:() => {},
})

export default FiltersContext;
