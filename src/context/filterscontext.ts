import React from 'react';

const FiltersContext = React.createContext({
    filtersState: {},
    submitFiltersState: null,
    changeMainFilter: (name: string, content: {option:string, value:string | any}) => {},
    changeOptionalsFilters: (name: string, content: {option:string, value:string}[]) => {},
    onClearAll:() => {},
    onClickApply:() => {},
})

export default FiltersContext;
