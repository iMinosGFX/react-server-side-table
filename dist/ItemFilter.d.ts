import { FilterItem } from './FiltersInteract';
import { filtersType } from "./ServerSideTable";
import { Translations } from './types/props';
declare type Props = {
    filter: FilterItem;
    ref?: any;
    filterParsedType: filtersType;
    translationsProps?: Translations;
};
declare const ItemFilter: (props: Props) => JSX.Element;
export default ItemFilter;
