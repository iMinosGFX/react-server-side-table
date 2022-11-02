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
```javascript
<ServerSideTable 
    ref={SSTRef}
    columns={columns}
    perPageItems={10}
    isFilter
    filtersList={filterColumns}
    filterParsedType="fuzzy"
    isSorter
    onDataChange={getData} 
    showAddBtn
    counterColumnToItemGoLeft={3}
    onAddClick={() => history.push('/app/users/new')}/>
```
---

#### Props : 
|            Props           |                                        Type                                        |                                                                                        Examples                                                                                        |                                 Notes                                 |
|:--------------------------:|:----------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------:|
| ref                        | Ref                                                                                | const SSTRef = useRef() ... ref={SSTRef}                                                                                                                                               | use to call reloadData() function                                     |
| columns                    | {Header:string, accessor: string, sorterAttribut,...}[] => More informations below |                                                                                                                                                                                        |                                                                       |
| onDataChange()             | function(requestParams: DataRequestParams): Promise<GPaginationObject<any>>        | ```` onDataChange={getData} ```                                                                                                                                                        |                                                                       |
| filterParsedType           | "rsql" \| "fuzzy"                                                                  |                                                                                                                                                                                        | Change for RSQL Or Fuzzy parser after every actions                   |
| isFilter?                  | boolean                                                                            |                                                                                                                                                                                        | default: false                                                        |
| filtersList?               | FilterItem[] details below                                                         |                                                                                                                                                                                        |                                                                       |
| isSorter?                  | boolean                                                                            | const filtersList = [ {name: "firstname", label: "Prénom", type: "text"}, {name:"enabled", label: "Statut", type:"booleanRadio", radioValues: [{value: "enabled", label: "Actif"}}]} ] | default: false                                                        |
| defaultSorter?             | string                                                                             |                                                                                                                                                                                        |                                                                       |
| perPageItems?              | 5 \| 10 \| 20 \| 50                                                                |                                                                                                                                                                                        | default: 5 Default per page item in first call api                    |
| isRenderSubComponent?      | boolean                                                                            |                                                                                                                                                                                        | default: false Enabled expanded rows                                  |
| renderSubComponent?        | JSX Component                                                                      |                                                                                                                                                                                        |                                                                       |
| showAddBtn?                | boolean                                                                            |                                                                                                                                                                                        | default: false                                                        |
| onAddClick()?              | void                                                                               |                                                                                                                                                                                        |                                                                       |
| darkMode?                  | boolean                                                                            |                                                                                                                                                                                        | default: false                                                        |
| withoutHeader              | boolean                                                                            |                                                                                                                                                                                        | default: false Remove all header of array (settings, filters, etc...) |
| marginPagesDisplayed              | number                                                                            |                                                                                                                                                                                        | react paginate props. default: 2 |
| pageRangeDisplayed              | number                                                                            |                                                                                                                                                                                        | react paginate props. default: 2 |
| translationsProps          | Translations details below                                                         |                                                                                                                                                                                        |                                                                       |
| filtersPosition            | "field" \| "list"                                                                  |                                                                                                                                                                                        | default: list Use to change filter view type.                         |
| tableId?                   | string                                                                             |                                                                                                                                                                                        | use to save filter after each submit                                  |
| optionnalsHeaderContent?   | ReactElement[]                                                                     |                                                                                                                                                                                        |                                                                       |
| enabledExport?             | boolean                                                                            |                                                                                                                                                                                        | Define custom objects for mobile only                                 |
| onRowClick()?  | (row: Row): void                                                                             | Add this to enabled on row Click function viewport                                                                                                                                            |                                                                       |
| mobileColumns?             | {Header:string, accessor: string, ...}[]                                           |                                                                                                                                                                                        |                                                                       |
| containerClassName?        | string                                                                             |                                                                                                                                                                                        |                                                                       |
| filtersContainerClassName? | string                                                                             |                                                                                                                                                                                        |                                                                       |
| selectableRows?            | boolean                                                                            |                                                                                                                                                                                        |                                                                       |
| selectedRowsAction?        | JSX.Element[]                                                                      |                                                                                                                                                                                        |                                                                       |
| withoutTotalElements?  | boolean                                                                             | Enabled this to remove total text                                                                                                                                            |                                                                       |
| showVerticalBorders?       | boolean                                                                            |                                                                                                                                                                                        |                                                                       |
| defaultProps?              | FilterStateItem                                                                    | If you want to use default props (filters, sort, hidden columns), you need to use useSST hooks, see more below                                                                         |                                                                       |
| counterColumnToItemGoLeft  | number                                                                             | Add this if filters is on right of viewport                                                                                                                                            |                                                                       |

##### GetData
The getData function must call the api using the parameters returned by onDataChange, and returning a PaginationObject object (content & pageabe). 
Here is an example: 
``` typescript
    const getData = e => {
        const {offset, perPage, filters, sorter} = e
        return ProfilesAPI.getStaffWithAccount({
            ...filters, //For fuzzy filter use "...filters", for RSQL filter use only "filters"
            size: perPage,
            page: offset,
            sort: !!sorter ? sorter : "enabled,asc"
        })
    }
```

##### Reload Data
In addition to the automatic reload after a change of page, filters, etc... It is possible to manually reload data from the parent component, just call the reloadData() function like this:  
```javascript
SSTRef.current.reloadData();
```

#### Columns oject
A column object can be composed like this: 

```typescript
Header: string, //Title of column
accessor: string //Accessor in data object to get value
Cell({value, row}): ReactElement
sorterAttribut?: string //Accessor to sort
alignment?: "left" | "center" | "right",
id?: 'expander', //Use this to enable SubRowComponent expander
exportFormat?: (e: CellValue): string, //Example: value => `${value+10}` 
```


##### Sorter 
The sorting is done automatically on the columns, you just have to define the sorting field as a property in the column object. 
```javascript
Header: Nom de la salle,
accessor:'name',
sorterAttribut: 'name', //api field
```

---
#### Filter
Filters are defined via an object, it will be automatically parsed according to the filter type of the api, by defining "rsql" or "fuzzy" in FilterParsedType. 
The Filter object is an array of FilterItem (see reference below)

Here example of filterItem : 
```javascript
const fitlers: FilterItem[] = [
    {name:'createdAt', label: "Date", type:"date", idAccessor:"createdAt"},
    {name:"createdByService", label:"Service", type:"text", idAccessor:"createdByService"},
    {name:"action", label:"Action", type:"text", idAccessor:"action"},
    {name:"actor", label:"Actor", type:"text", idAccessor:"actor"},
]
```

###### Saved and use Defaults Props

You can enable filter saving by choosing a unique "tableId", usually the pattern is: `[project-name]-[entity]-table`

You also have the possibility to create default filters, for that you have to do several things: 
- Import useSST 
- Create a filter variable
- Transform this variable ready to use by SST
- import this variable into SST. 

Here is an example: 
```javascript
import {ServerSideTable, useSST} from '@optalp/react-server-side-table';
const TABLE_ID = "tv2-logger-table"

const {createDefaultProps} = useSST()
const [defaultsProps, setDefaultsProps] = useState<any>(null)

const filters: FilterItem[] = [...]

const defaultFilters: FilterStateItem  = {
    createdAt: {
        type: "date",
        label: "Date",
        parsedValue: "",
        main: {option: "atDay", value: moment().format("YYYY-MM-DD")},
        optionals: []
    },
}

useEffect(() => {
    createDefaultProps({
        filtersList: filters,
        defaultFilters: defaultFilters
        tableId: TABLE_ID,
        filtersParsedType: "rsql",
        columns: columns
    })
    .then(setDefaultsProps)
}, [])

return(
    <>
      {!!defaultsProps && 
        <ServerSideTable
            ref={ServerSideTableRef}
            columns={columns}
            isFilter
            filtersList={filterColumns}
            filterParsedType="rsql"
            isSorter
            onDataChange={getData}
            defaultProps={defaultsProps}
            tableId={TABLE_ID}/>
    }
    </>
)
```

```javascript
<ServerSideTable 
    ref={ServerSideTableRef}
    columns={columns}
    onDataChange={getData}
    isFilter
    filtersList={fitlers}
    filterParsedType="rsql"
    defaultFilters={createdFilters}
    tableId={tableId}/>
```

###### Locked Filters
In addition to that, you can add locked Filters, useful to create a default filter untouchable by the user, just add the attribute `locked: true` in the defaultFilter object. 

```javascript
const defaultFilters: FilterStateItem = {
    actionId: {
        type: "text",
        label: "ID",
        parsedValue: "",
        main: {option: "equal", value:"3496164921410732033"},
        optionals: [],
        locked: true
    }
}
```

---

##### Sub component
To activate the subComponent, you just have to add the boolean isRenderSubComponent and the props renderRowSubComponent which expects a JSX element. 

Here an example : 
```javascript
const renderRowSubComponent = React.useCallback(
    ({row}) => ( // All data in a row send by SST
        <div style={{width: "100%", margin: "0 auto"}}>
            <p>{row.original.name}</p>
        </div>
    ),
[])

[...]

<ServerSideTable
    {...}
    isRenderSubComponent
    renderSubComponent={renderRowSubComponent}/>
    
```

---

##### Select Rows
Just add the `selectableRows` attribute and a set of JSX.Element in a `selectedRowsAction` attribute which will be displayed only when at least one row is selected. 

Then you just have to use the `getSelectedRows` function (accessible via the ref) to get the array of selected rows.

##### API Functions
There are APIs to interact with the data in the array, which are accessible to it. 

`SSTRef.current.reloadData()` : Reload the data manually.
`SSTRef.current.getSelectedRows()` : Retrieves the selected rows.


---
#### Types

``` typescript
type RefHandler = {
    reloadData: () => void,
    getSelectedRows: () => any[]
} 
```

``` typescript
interface DataRequestParam {
    offset: number, 
    perPage: number, 
    filters: string | object, 
    sorter?:string
}
```

``` typescript
type FilterType = "text" | "number" | "date" 
type TextFilter = "contains" | "equal" | "startWith" | "finishWith"
type NumberFilter = "equal" | "moreThan" | "lessThan" | "between"
type DateFilter = "atDay" | "minDay" | "maxDay"

type DefaultFiltersOptions = TextFilter | NumberFilter | DateFilter

type FilterStateItemValue = {
    option: DefaultFiltersOptions,
    value: string
}

interface FilterStateItem {
    [key:string]: {
        type?: FilterType,
        label?: string,
        parsedValue?: string,
        main?: FilterStateItemValue              
        optionals?: FilterStateItemValue[]
        locked?: boolean
    }
}

type DefaultProps = {
    filters: FilterStateItem,
    sort: SorterRecord,
    hideColumns: string[] 
}
```

``` typescript
type Sorter = {
    attribut: string,
    value: "asc" | "desc"
}

interface SorterRecord {
    [key:string]: Sorter
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
    loading?: string
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
        filterType:string,
        filterList: string,
        filterField: string
        clearCache?: string
    }
}
```

``` typescript
type GPaginationObject<T> = {
    pageable: Pageable
    last: boolean,
    totalPages: number,
    totalElements: number,
    sort: Sort
    numberOfElements: number,
    first: boolean,
    size: number,
    number: number,
    empty: boolean
    content: T[]
}
```

