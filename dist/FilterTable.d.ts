declare type Props = {
    columns: {
        name: string;
        label: string;
        filterType: string;
        selectOptions?: {
            value: string;
            label: string;
        }[];
    }[];
    onFilterChange(filters: any): void;
    isExtend: boolean;
    filterInputsMaxWidth?: number;
};
declare const FilterTable: (props: Props) => JSX.Element;
export default FilterTable;
