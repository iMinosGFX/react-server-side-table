import { FilterItem } from './FiltersInteract';
import { FiltersPosition, filtersType } from "./ServerSideTable";
import { Translations } from './types/props';
declare type Props = {
    filter: FilterItem;
    ref?: any;
    filterParsedType: filtersType;
    translationsProps?: Translations;
    filtersPosition?: FiltersPosition;
    darkMode: boolean;
};
declare const ItemFilter: (props: Props) => JSX.Element;
export default ItemFilter;
