import { Translations } from './types/props';
import { LineSpacing } from './types/entities';
import { ExportType } from './types/components-props';
declare type Props = {
    columns: any[];
    hiddenColumns: string[];
    onHiddenColumnsChange(e: string[]): void;
    onLineSpacingChange(e: LineSpacing): void;
    translationsProps: Translations;
    enabledExport?: boolean;
    handleExport?(e: ExportType): Promise<any>;
    darkMode: boolean;
    tableId?: string;
    lineSpacing: LineSpacing;
    showVerticalBorders: boolean;
    onShowVerticalBorderChange(e: boolean): void;
};
declare const SettingsInteractor: (props: Props) => JSX.Element;
export default SettingsInteractor;
