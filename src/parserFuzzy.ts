import _ from 'lodash';


export function parseFilterFuzzy(filters: any):object {
    let _resultFilter = {}
    !_.isEmpty(filters) && Object.entries(filters).flatMap(([key, value]) => {
        if(!!value["main"]["value"] && value["main"]["value"].length > 0){
            switch(value["type"]){
                case 'text': case 'number': case 'date': 
                    _resultFilter[key] = value["main"]["value"]
                    break;
                case 'checkbox': 
                    _resultFilter[key] = value["main"]["value"].join(',')
                    break;
                case 'booleanRadio': 
                    value["main"]["value"].forEach(boolean => {
                        if(boolean.status !== "NA")
                            _resultFilter[boolean.name] = boolean.status === "YES" ? "true" : "false" 
                    })
                default: 
                    break;
            }
        }
    })
    return _resultFilter
}
