import { FilterItem } from '../FiltersInteract';
import { FiltersPosition, filtersType } from "../ServerSideTable";
import { Translations } from '../types/props';
declare type Props = {
    filter: FilterItem;
    onEnterPress(): void;
    index: "main" | number;
    filterParsedType: filtersType;
    translationsProps: Translations;
    filtersPosition?: FiltersPosition;
    darkMode: boolean;
};
declare const DateFilter: (props: Props) => JSX.Element;
export default DateFilter;
