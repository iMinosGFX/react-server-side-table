import { Translations } from './types/props';
import { FilterItem, filtersType } from './types/entities';
declare type Props = {
    filter: FilterItem;
    ref?: any;
    filterParsedType: filtersType;
    translationsProps?: Translations;
    darkMode: boolean;
    isOnRightOfViewport?: boolean;
    isField?: boolean;
    onClose?(): void;
};
declare const ItemFilter: (props: Props) => JSX.Element;
export default ItemFilter;
