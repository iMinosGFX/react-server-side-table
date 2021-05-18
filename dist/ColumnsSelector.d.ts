declare type Props = {
    columns: any[];
    hiddenColumns: string[];
    onChange(e: string[]): void;
};
declare const ColumnsSelector: (props: Props) => JSX.Element;
export default ColumnsSelector;
