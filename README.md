## React Server Side Table

React Server Side Table is a is a component based on React-Table, works the same way, except that it introduces the notion of pagination, sorting and filtering in Server Side simply. 
It is also possible to apply user parameters, such as the display comfort or the columns to be displayed. 

Here is how to install it: 

```
npm i @optalp/react-server-side-table
```

Then how to import it : 
```
import ServerSideTable from "@optalp/react-server-side-table"
```

Then you can call him in the renderer, here an example : 
```
<ServerSideTable 
    ref={SSTRef}
    columns={columns}
    data={data}
    perPageItems={10}
    isFilter
    filtersList={filterColumns}
    filterParsedType="fuzzy"
    isSorter
    sorterSelect={sorterSelect}
    onDataChange={(e) => getData(e)} 
    showAddBtn
    onAddClick={() => history.push('/app/users/new')}/>
```
---

#### Props : 
| **Props**             | **Type**                                                                                | **Examples**                                                                                                                                                                                         | **Notes**                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| ref                   | Ref                                                                                     | const SSTRef = useRef() ...  ref={SSTRef}                                                                                                                                                            | use to call reloadData() function                                         |
| columns               | {Header:string, accessor: string, ...}[]                                                |                                                                                                                                                                                                      |                                                                           |
| data                  | Pageable Object                                                                         |                                                                                                                                                                                                      |                                                                           |
| onDataChange()        | function({offset: number, perPage: number, filters: string \| object, sorter?: string}) | ```` onDataChange={e => getData(e)} ```                                                                                                                                                              |                                                                           |
| filterParsedType      | "rsql" \| "fuzzy"                                                                       |                                                                                                                                                                                                      | Change for RSQL Or Fuzzy parser after every actions                       |
| isFilter?             | boolean                                                                                 |                                                                                                                                                                                                      | *default: false*                                                          |
| filtersList?          | FilterItem[] *details below*                                                            |                                                                                                                                                                                                      |                                                                           |
| isSorter?             | boolean                                                                                 | ``` const filtersList = [    {name: "firstname", label: "Prénom", type: "text"},    {name:"enabled", label: "Statut", type:"booleanRadio", radioValues: [{value: "enabled", label: "Actif"}}]} ] ``` | *default: false*                                                          |
| sorterSelect?         | {value: string, label:string}[]                                                         |                                                                                                                                                                                                      |                                                                           |
| defaultSorter?        | string                                                                                  |                                                                                                                                                                                                      |                                                                           |
| perPageItems?         | 5 \| 10 \| 20 \| 50                                                                     |                                                                                                                                                                                                      | *default: 5* Default per page item in first call api                      |
| isRenderSubComponent? | boolean                                                                                 |                                                                                                                                                                                                      | *default: false* Enabled expanded rows                                    |
| renderSubComponent?   | JSX Component                                                                           |                                                                                                                                                                                                      |                                                                           |
| showAddBtn?           | boolean                                                                                 |                                                                                                                                                                                                      | *default: false*                                                          |
| onAddClick()?         | void                                                                                    |                                                                                                                                                                                                      |                                                                           |
| showOptionalBtn?      | boolean                                                                                 |                                                                                                                                                                                                      | *default: false*                                                          |
| optionalIconBtn?      | JSX Component                                                                           | <FaFileExport />                                                                                                                                                                                     |                                                                           |
| onOptionalBtnClick()? | void                                                                                    |                                                                                                                                                                                                      |                                                                           |
| darkMode?             | boolean                                                                                 |                                                                                                                                                                                                      | *default: false*                                                          |
| withoutHeader         | boolean                                                                                 |                                                                                                                                                                                                      | *default: false*  Remove all header of array (settings, filters, etc...)  |
| translationsProps     | Translations *details below*                                                            |                                                                                                                                                                                                      |                                                                           |
| filtersPosition       | "field" \| "list"                                                                       |                                                                                                                                                                                                      | *default: list*  Use to change filter view type.                          |

##### GetData
The getData function must call the api using the parameters returned by onDataChange, and returning a Fuzzy object (content & pageabe). 
Here is an example: 
``` typescript
    const getData = e => {
        const {offset, perPage, filters, sorter} = e
        setLoading(true)
        ProfilesAPI.getStaffWithAccount({
            ...filters, //For fuzzy filter use "...filters", for RSQL filter use only "filters"
            size: perPage,
            page: offset,
            sort: !!sorter ? sorter : "enabled,asc"
        })
        .then(data => {
            setData(data)
            setLoading(false)
        })
    }
```

##### Reload Data
In addition to the automatic reload after a change of page, filters, etc... It is possible to manually reload data from the parent component, just call the reloadData() function like this:  
```
SSTRef.current.reloadData();
```

##### Sorter 
The sorterSelect parameter must have a value/label array. The component takes care of defining for each property, the 2 sorting options "Asc" & "Desc". 

You can define a defaultSorter by sending the property followed by "asc" or "desc".
**Example : "enabled,asc"**

##### Sub component
//TODO
##### Filters Position
//TODO
---
#### Types

``` typescript
type FilterItem = {
    label: string, 
    type: "text" | "number" | "date" | "checkbox" | "booleanRadio" | "geoloc", 
    checkboxValues?: {value: string, label:string}[],
    radioValues?: {value:string, label:string}[],
    defaultOpen?:boolean
} 
```

``` typescript
By default, the French translation is activated

type Translations = {
    add?:string,
    sortBy?: string,
    appliedFilters?:string,
    linePerPage?:string,
    clearAll?: string,
    clear?: string
    apply?:string
    filterFor?:string
    and?:string
    yes?:string
    no?:string
    na?:string
    filtersViewer?: {
        contain?: string
        startWith?: string
        finishWith?: string
        equal?: string
        moreThan?: string
        lessThan?: string
        between?: string
        atDay?: string
        minDay?: string
        maxDay?: string
        kmAroundOf?: string
    }
    settings?:{
        toggleColumns?: string,
        lineSpacing?: string,
        export?: string,
        back?: string,
        highHeight?: string,
        mediumHeight?:  string,
        smallHeight?: string,
    }
}


***

