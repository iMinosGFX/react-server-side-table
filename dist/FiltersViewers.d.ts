import React from 'react';
import { Translations } from './types/props';
declare type Props = {
    translationsProps?: Translations;
    darkMode: boolean;
    lockedFilters?: string[];
};
declare const FiltersViewers: React.FC<Props>;
export default FiltersViewers;
