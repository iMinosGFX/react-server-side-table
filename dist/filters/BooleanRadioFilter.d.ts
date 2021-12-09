import { FilterItem } from '../FiltersInteract';
import { Translations } from '../types/props';
declare type Props = {
    filter: FilterItem;
    translationsProps: Translations;
    darkMode: boolean;
};
declare const BooleanRadioFilter: (props: Props) => JSX.Element;
export default BooleanRadioFilter;
