import { Translations } from './types/props';
declare type Props = {
    columns: any[];
    hiddenColumns: string[];
    onHiddenColumnsChange(e: string[]): void;
    onLineSpacingChange(e: string): void;
    onFilterTypeChange(e: string): void;
    filterType: string;
    translationsProps: Translations;
    enabledExport?: boolean;
    onExportClick?(): void;
    darkMode: boolean;
};
declare const SettingsInteractor: (props: Props) => JSX.Element;
export default SettingsInteractor;
