import { filtersType } from './ServerSideTable';
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
};
declare type Props = {
    filters?: FilterItem[];
    onSubmit(e: any): void;
    filterParsedType: filtersType;
    translationsProps?: Translations;
    filtersPosition?: "field" | "list";
};
declare const FiltersInteract: (props: Props) => JSX.Element;
export default FiltersInteract;
