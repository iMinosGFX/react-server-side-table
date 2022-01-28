import { Translations } from './types/props';
import { filtersType } from './types/entities';
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
    idAccessor?: string;
};
declare type Props = {
    filters?: FilterItem[];
    onSubmit(e: any): void;
    filterParsedType: filtersType;
    translationsProps?: Translations;
    darkMode: boolean;
    isMobile?: boolean;
};
declare const FiltersInteract: (props: Props) => JSX.Element;
export default FiltersInteract;
