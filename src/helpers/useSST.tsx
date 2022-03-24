import {useContext} from 'react';
import FiltersContext from '../context/filterscontext';
import { createDefaultFilter, createDefaultProps } from './createDefaultFilters';

export const useSST = () => {

    const filtersState = useContext(FiltersContext)

    if (!filtersState) {
        throw Error(
          'The `useSST` hook must be called from a descendent of the `SSTProvider`.'
        );
      }

    return{
        createFilters: createDefaultFilter,
        createDefaultProps: createDefaultProps
    }
}