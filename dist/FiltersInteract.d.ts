import { FiltersPosition, filtersType } from './ServerSideTable';
import { Translations } from './types/props';
export declare type FilterItem = {
    name: string;
    label: string;
    type: "text" | "number" | "date" | "checkbox" | "booleanRadio" | "geoloc";
    checkboxValues?: {
        value: string;
        label: string;
    }[];
    radioValues?: {
        value: string;
        label: string;
    }[];
    defaultOpen?: boolean;
    widthPercentage?: number;
};
declare type Props = {
    filters?: FilterItem[];
    onSubmit(e: any): void;
    filterParsedType: filtersType;
    translationsProps?: Translations;
    filtersPosition?: FiltersPosition;
    darkMode: boolean;
    isMobile?: boolean;
};
declare const FiltersInteract: (props: Props) => JSX.Element;
export default FiltersInteract;
