import { FilterItem } from '../FiltersInteract';
import { filtersType } from "../ServerSideTable";
import { Translations } from '../types/props';
declare type Props = {
    filter: FilterItem;
    onEnterPress(): void;
    index: "main" | number;
    filterParsedType: filtersType;
    translationsProps: Translations;
    darkMode: boolean;
};
declare const TextFilter: (props: Props) => JSX.Element;
export default TextFilter;
