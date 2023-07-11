import moment from "moment"
import _ from "lodash"
import { NewFilterItem } from './types/entities';

function translateOptionsToOperator(opt: string, val:string): string{
    switch(opt){
        case 'contains':
            return `=like="*${val}*"`
        case 'startWith' :
            return `=like="${val}*"`
        case 'finishWith' :
            return `=like="*${val}"`
        case 'equal' :
            return `==${val}`
        case 'moreThan' :
            return `>=${val}`
        case 'lessThan' :
            return `<=${val}`
        case 'between' :
            return `=bw=(${val.split('-')[0]},${val.split('-')[1]})`
        case 'atDay' :
            return `=bw=(${moment(val).startOf('day').toISOString()},${moment(val).add(1,'day').startOf('day').toISOString()})`
        case 'minDay' :
            return `>=${moment(val).startOf('day').toISOString()}`
        case 'maxDay' :
            return `<=${moment(val).endOf('day').toISOString()}`
        default:
            return opt
    }
}

/**
 * Parse commons filter : Text, number & date
 */
function parseCommons(filter: NewFilterItem): string{
    let parse = '';
    if(!!filter?.value){
        parse += `${filter.name}${translateOptionsToOperator(filter.option, filter.value)};`
    }
    return parse
}

function parseCheckbox(filter: NewFilterItem): string{
    let parse = '',
        _parsedType = filter.type === "checkbox" ? "in" : filter.type === "checkboxCtn" ? "ct" : filter.type === "checkboxCtnIntegers" ? "cti" : "cts"
        if(!!filter?.value?.length){
            // @ts-ignore
            parse += `${filter.name}=${_parsedType}=(${filter.value.join(',')});`
        }
    return parse
}

/**
 * Parse boolean filter
 * Return =ct=() where status === "YES" || "NO" (T,F)
 */
function parseBooleanRadios(filter: NewFilterItem): string{
    let parse = ''
    if(filter.value !== "NA"){
        parse += `${filter.name}==${filter.value === "YES" ? "true" : "false"};`
    }
    return parse
}

export function newParseFilterRSQL(filters: NewFilterItem[]): string {
    let parsedString = ''
    filters.flatMap((filter) => {
        switch(filter.type){
            case 'text': case 'number': case 'date': 
                parsedString += parseCommons(filter) 
                break;
            case 'checkbox': case 'checkboxCtn': case 'checkboxCtnIntegers': case 'checkboxCtnStrings':
                parsedString += parseCheckbox(filter)  
                break;
            case 'booleanRadio' : 
                parsedString += parseBooleanRadios(filter)  
                break;
            // case 'geoloc' : 
            //     parsedString += parseGeoloc(key, value)  
            //     break;
        }
    })
    return parsedString.slice(0,-1)
}
