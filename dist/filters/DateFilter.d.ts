import { FilterItem } from '../FiltersInteract';
import { Translations } from '../types/props';
import { filtersType } from '../types/entities';
declare type Props = {
    filter: FilterItem;
    onEnterPress(): void;
    index: "main" | number;
    filterParsedType: filtersType;
    translationsProps: Translations;
    darkMode: boolean;
};
declare const DateFilter: (props: Props) => JSX.Element;
export default DateFilter;
