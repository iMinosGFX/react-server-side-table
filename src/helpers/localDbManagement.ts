import moment from 'moment';
import { resolve } from 'path';
import { LineSpacing, SorterRecord } from '../types/entities';
const db_name = "opta_planning_db";

const getDataBaseName = (tableName:string): string => `${tableName.split("-")[0].toUpperCase()}_TABLES`

type Data = {
    filters?: any,
    sort?: SorterRecord
    hideColumns?: string[]
    showVerticalBorders?: boolean
    lineSpacing?: LineSpacing
}

function getDataFromTable(tableName:string): Promise<Data>{
    return new Promise (function(resolve) {
        //@ts-ignore
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        
        let request = indexedDB.open(getDataBaseName(tableName), 1),
        db,
        tx,
        store;

        request.onupgradeneeded = function(e){
            let db = request.result,
                store = db.createObjectStore("DataStore",{
                    keyPath: "tableName"
                });
        }

        request.onerror = function(e){
            console.log('There was an error : ' + e.target)
        }

        request.onsuccess = function(e){
            db = request.result;
            tx =  db.transaction(["DataStore"], "readwrite");
            store = tx.objectStore("DataStore");

            db.onerror = function(e){
                console.log("ERROR" + e.target.error);
            }

            let q1 = store.get(tableName);
            q1.onsuccess = function(){
                return resolve(q1.result);
            }

            tx.oncomplete = function(){ db.close(); }
        }
    })
}

function storeDataByName(data: Data, tableName: string){

    return new Promise (function(resolve) {

        //@ts-ignore
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        
        let request = indexedDB.open(getDataBaseName(tableName), 1),
        db,
        tx,
        store;

        request.onerror = function(e){
            console.log('There was an error : ' + e.target)
        }

        request.onsuccess = function(e){
            db = request.result;
            tx =  db.transaction(["DataStore"], "readwrite");
            store = tx.objectStore("DataStore");

            db.onerror = function(e){
                console.log("ERROR" + e.target.error);
            }

            let q2 = store.get(tableName);
            q2.onsuccess = function(){
                const table = q2.result;

                store.put({
                    tableName: tableName, 
                    filters: !!data.filters ? data.filters : !!table?.filters ? table.filters : null,
                    sort: !!data.sort ? data.sort : !!table?.sort ? table.sort : null,
                    hideColumns: !!data.hideColumns ? data.hideColumns : !!table?.hideColumns ? table.hideColumns : [],
                    showVerticalBorders: data.showVerticalBorders !== undefined ? data.showVerticalBorders : table?.showVerticalBorders !== undefined ? table.showVerticalBorders : false,
                    lineSpacing: !!data.lineSpacing ? data.lineSpacing : !!table?.lineSpacing ? table.lineSpacing : "medium",
                })
                resolve(null)
            }

            let q1 = store.get(tableName);
            q1.onsuccess = function(){
                return resolve(q1.result);
            }

            tx.oncomplete = function(){ db.close(); }
        }
    })
}

function deleteKeyInDb(tableName:string) {
    //@ts-ignore
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    
    let request = indexedDB.open(getDataBaseName(tableName), 1),
    db,
    tx,
    store;

    request.onerror = function(e){
        console.log('There was an error : ' + e.target)
    }

    request.onsuccess = function(e){
        db = request.result;
        tx =  db.transaction(["DataStore"], "readwrite");
        store = tx.objectStore("DataStore");

        var objectStoreRequest = store.delete(tableName);
        objectStoreRequest.onsuccess = function(e){
            resolve("OK")
        }
        resolve("OK")
    }
}

function getTableFilters(tableId?: string): any{
    if(!!tableId){
        return getDataFromTable(tableId)
            .then(res => res?.filters)
    }
}

export {
    getDataFromTable,
    storeDataByName,
    deleteKeyInDb,
    getTableFilters
}