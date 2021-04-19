declare type Props = {
    columns: any[];
    onChange(e: string[]): void;
};
declare const ColumnsSelector: (props: Props) => JSX.Element;
export default ColumnsSelector;
