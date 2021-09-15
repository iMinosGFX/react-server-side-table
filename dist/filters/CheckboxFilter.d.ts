import { FilterItem } from '../FiltersInteract';
import { FiltersPosition } from '../ServerSideTable';
declare type Props = {
    filter: FilterItem;
    filtersPosition: FiltersPosition;
    darkMode: boolean;
};
declare const CheckboxFilter: (props: Props) => JSX.Element;
export default CheckboxFilter;
