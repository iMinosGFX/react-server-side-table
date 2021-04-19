declare type Props = {
    columns: any;
    data: any;
    renderRowSubComponent: any;
    filters?: {
        name: string;
        label: string;
        filterType: string;
        headerId?: string;
    }[];
    hiddenColumns: string[];
};
declare const Table: ({ columns, data, renderRowSubComponent, hiddenColumns }: Props) => JSX.Element;
export default Table;
