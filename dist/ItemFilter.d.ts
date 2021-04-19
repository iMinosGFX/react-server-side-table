import { FilterItem } from './FiltersInteract';
import { filtersType } from "./ServerSideTable";
declare type Props = {
    filter: FilterItem;
    ref?: any;
    filterParsedType: filtersType;
};
declare const ItemFilter: (props: Props) => JSX.Element;
export default ItemFilter;
