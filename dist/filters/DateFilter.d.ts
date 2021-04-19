import { FilterItem } from '../FiltersInteract';
import { filtersType } from "../ServerSideTable";
declare type Props = {
    filter: FilterItem;
    onEnterPress(): void;
    index: "main" | number;
    filterParsedType: filtersType;
};
declare const DateFilter: (props: Props) => JSX.Element;
export default DateFilter;
