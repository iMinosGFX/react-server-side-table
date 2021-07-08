declare type Props = {
    columns: any[];
    hiddenColumns: string[];
    onHiddenColumnsChange(e: string[]): void;
    onLineSpacingChange(e: string): void;
    enabledExport?: boolean;
};
declare const SettingsInteractor: (props: Props) => JSX.Element;
export default SettingsInteractor;
