import moment from "moment"
import _ from "lodash"

function translateOptionsToOperator(opt: string, val:string): string{
    switch(opt){
        case 'contains':
            return `=like=*${val}*`
        case 'startWith' :
            return `=like=${val}*`
        case 'finishWith' :
            return `=like=*${val}`
        case 'equal' :
            return `==${val}`
        case 'moreThan' :
            return `>=${val}`
        case 'lessThan' :
            return `<=${val}`
        case 'between' :
            return `=bw=(${val.split('-')[0]},${val.split('-')[1]})`
        case 'atDay' :
            return `=bw=(${moment(val).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS')}Z,${moment(val).add(1,'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS')}Z)`
        case 'minDay' :
            return `>=${moment(val).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`
        case 'maxDay' :
            return `<=${moment(val).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`
        default:
            return opt
    }
}

/**
 * Parse commons filter : Text, number & date
 */
function parseCommons(name: string, filter: any): string{
    let parse = '';
    if(filter["main"].value.length > 0)
        parse += `${name}${translateOptionsToOperator(filter["main"].option, filter["main"].value)};`
    filter["optionals"].map(optional => {
        if(optional.value.length > 0){
            parse += `${name}${translateOptionsToOperator(optional.option, optional.value)};`
        }
    })
    return parse
}

/**
 * Parse radio filter => string[]
 * Return =ct=(*list of string.join(',')*)
 */
function parseCheckbox(name:string, filter: any): string{
    let parse = ''
    if(filter["main"].value.length > 0){
        parse += `${name}=in=(${filter["main"].value.join(',')});`
    }
    return parse
}

/**
 * Parse boolean filter
 * Return =ct=() where status === "YES" || "NO" (T,F)
 */
function parseBooleanRadios(filter: any): string{
    let parse = ''
    filter["main"].value.map(boolean => {
        if(boolean.status !== "NA"){
            parse += `${boolean.name}==${boolean.status === "YES" ? "true" : "false"};`
        }
    })
    return parse
}

/**
 * Parse geoloc Filter
 * Return =gin=(lat, lng, geoRad)
 */
function parseGeoloc(name:string, filter: any): string{
    let parse = ''
    if(filter["main"].value.lat !== 0 && filter["main"].value.lng !== 0){
        parse += `${name}=gin=(${filter["main"].value.lng},${filter["main"].value.lat}, ${filter["main"].option});`
    }
    return parse
}

export function parseFilterRSQL(filters: any):string {
    let parsedString = ''
    !_.isEmpty(filters) && Object.entries(filters).flatMap(([key, value]) => {
        switch(value["type"]){
            case 'text': case 'number': case 'date': 
                parsedString += parseCommons(key, value) 
                break;
            case 'checkbox' : 
                parsedString += parseCheckbox(key, value)  
                break;
            case 'booleanRadio' : 
                parsedString += parseBooleanRadios(value)  
                break;
            case 'geoloc' : 
                parsedString += parseGeoloc(key, value)  
                break;
        }
    })
    return parsedString.slice(0,-1)
}
