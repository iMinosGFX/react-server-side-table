import React from 'react';
import { SorterRecord } from '../ServerSideTable';

const FiltersContext = React.createContext({
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
