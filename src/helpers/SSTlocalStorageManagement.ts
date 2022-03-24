import _ from 'lodash';
import { getDataFromTable, storeDataByName } from './localDbManagement';

// export function getTableFilters(tableId?: string): any{
//     if(!!tableId){
//         return getDataFromTable(tableId)
//             .then(res => res?.filters)
//     }
//     // return !!tableId && !!localStorage.getItem(tableId) ? JSON.parse(localStorage.getItem(tableId)) : {}
// }

// export function registerTableFilters(tableId: string, filters: any): void {
//     if(!!filters && !_.isEmpty(filters)){
//         storeDataByName({filters: filters}, tableId)
//         // localStorage.setItem(tableId, JSON.stringify(filters))
//     }
// }

// export function destroyTableFiltersStorage(tableId: string): void{
//     localStorage.removeItem(tableId)
// }