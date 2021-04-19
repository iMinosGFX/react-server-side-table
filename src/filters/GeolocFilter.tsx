import React, {useContext} from 'react'
import { FilterItem } from '../FiltersInteract';
import styled  from 'styled-components';
import _ from "lodash"
import {FiltersContext} from "../ServerSideTable"
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

type Props = {
    filter: FilterItem
}

const FilterContainer = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 8px 5px;
    margin: 10px 0;
    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #888;
        cursor: pointer;
        label {
            font-size: 14px;
        }
        .chevron{
            padding-right: 5px;
        }
    }
    input[type='text']{
        background: #fff;
        height: 35px;
        line-height: 35px;
        border: 1px solid #E0E0E0;
        width: 100%;
        padding-left: 5px;
        float: right;
        margin-bottom: 10px;
        color: #435F71 !important;
    }
    .filterSelectChoice__control{
        border: none;
        margin-bottom: 10px;
        border: 1px solid #E0E0E0;
    }
    .filterSelectChoice__input{
        input{
            height: 1.2rem !important;
            font-size: 15px !important;
        }
    }
`

const GeolocFilter = (props: Props) => {

    const {filter} = props
    const filtersState = useContext(FiltersContext)
  
    const handleChange = (address:string): void => {
        filtersState.changeMainFilter(filter.name, {
            option: filtersState.filtersState[filter.name]["main"].option,
            value: {lat: 0,lng: 0, display: address}
        })
    };
     
    const handleSelect = (address): void => {
        geocodeByAddress(address)
        //   .then(results => getLatLng(results[0]))
        .then(results => {
            getLatLng(results[0])
                .then(coords => {
                    filtersState.changeMainFilter(filter.name, {
                        option: filtersState.filtersState[filter.name]["main"].option,
                        value: {lat: coords.lat,lng: coords.lng, display: results[0].formatted_address}
                    })
                })
        })
          .catch(error => console.error('Error', error));
    };

    const handleOptionChange = ({currentTarget}) => {
        const {value} = currentTarget
        filtersState.changeMainFilter(filter.name, {
            option: value,
            value: filtersState.filtersState[filter.name]["main"].value
        })
    }

    return(
        <FilterContainer>
                <PlacesAutocomplete
                    value={filtersState.filtersState[filter.name]["main"]["value"].display}
                    onChange={handleChange}
                    onSelect={handleSelect}>
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                        {...getInputProps({
                            placeholder: 'Recherche...',
                            className: 'location-search-input',
                        })}
                        />
                        <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion,i) => {
                            const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                            return (
                            <div
                                {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                                })}
                                key={i}
                            >
                                <span>{suggestion.description}</span>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    )}
                </PlacesAutocomplete>
                <div className="radialContainer">
                    <label>Zone de recherche (km)</label>
                    <input 
                        type="text" 
                        value={filtersState.filtersState[filter.name]["main"].option}
                        onChange={handleOptionChange}/>
                </div>
        </FilterContainer>
    )
}

export default GeolocFilter