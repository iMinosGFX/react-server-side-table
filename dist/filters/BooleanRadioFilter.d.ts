import { FilterItem } from '../FiltersInteract';
import { Translations } from '../types/props';
import { FiltersPosition } from '../ServerSideTable';
declare type Props = {
    filter: FilterItem;
    translationsProps: Translations;
    filtersPosition: FiltersPosition;
    darkMode: boolean;
};
declare const BooleanRadioFilter: (props: Props) => JSX.Element;
export default BooleanRadioFilter;
