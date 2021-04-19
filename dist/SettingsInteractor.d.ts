declare type Props = {
    columns: any[];
    onHiddenColumnsChange(e: string[]): void;
    onLineSpacingChange(e: 'high' | 'medium' | 'small'): void;
};
declare const SettingsInteractor: (props: Props) => JSX.Element;
export default SettingsInteractor;
