import styled from 'styled-components'
import {transparentize} from "polished"
import { filtersType } from '../types/entities'

const TableContainer = styled("div")<{darkMode: boolean}>`
    padding-top: 10px;
    margin: 0 5px;
    .extender{
        position: absolute; 
        top: -25px;
        left:0;
        width: 40px;
        height: 25px;
        line-height: 25px;
        font-size: 18px;
        text-align: center; 
        background-color: #E0E0E0;
        color: #606060;
        border-radius: 5px 5px 0 0;
        cursor: pointer;
    }
    .selectContainer{
        display: inline-block !important;
        width: 250px;
        text-align: left;
        padding-right: 20px;
        .ServerSideTableFilterSelect__control{
            background: ${props => props.darkMode ? "#2a3c4e" : "#fff"};
            border:1px solid ${props => props.darkMode ? "#272d3a" : "#E0E0E0"};
            .ServerSideTableFilterSelect__placeholder{
                color: ${props => props.darkMode ? "#bccde0" : "#2a3c4e" };
            }
        }
        .ServerSideTableFilterSelect__menu{
            background: ${props => props.darkMode ? "#2a3c4e" : "#fff;"};
            color: ${props => props.darkMode ? "#bccde0" : "#435F71"};
        }
        .ServerSideTableFilterSelect__input{
            input{
                height: 1rem !important;
            }

        }   
    } 
    .SST_HEADER{
        padding: .4rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-right: 10px;
        flex-direction: column;
        .SST_actions_buttons{
            display: flex;
            align-items: center;
            & > * {
                margin: 0 5px;
            }
        }
    }
    .SST_selected_rows_buttons{
        padding: .4rem;
        display: flex;
        align-items: center;
        & > * {
            margin: 0 5px;
        }
    }
    @media only screen and (max-width: 540px){
        .SST_HEADER{
            display: contents;
            button{
                float: right;
                margin-bottom: 10px;
            }
            .table-actions-container{
                clear: both;
                justify-content: space-between;
                margin-bottom: 10px;
            }
        }
    }
`

const TableStyles = styled("div")<{lineSpacing: string, darkMode: boolean}>`
    input[type="checkbox"]{
        position: relative !important;
        left: initial !important;
    }
  table {
    border-spacing: 0;
    width:100%;
      thead{
        border-top: 1px solid ${props => props.darkMode ? "#141b24" : "#E7EAF3"} !important;
        border-bottom: 1px solid #E7EAF3 !important;
        height: 50px;
        text-align:left;
        padding:0 40px;
        background: ${props => props.darkMode ? "#272d3a" : "#F8FAFD"};
        color: #8497B1;
        .SST_header_cell{
            position: relative;
            .SST_header_container{
                display: flex;
                align-items: center;
                justify-content: left;
                & > * {
                    margin:0 2px;
                }
                .SST_header_title{
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    span{
                        font-weight: 600;
                    }
                }
                i{
                    &.fitler_icon{
                        cursor: pointer;
                        margin-left: 3px;
                        padding: 2px 5px;
                        border-radius: 3px;
                        transition: .2s;
                        transform:translateY(-1px);
                        &.SST_filter_active{
                            color: #3498db;
                            background: rgba(0,0,0,.05);
                        }
                    }
                    &.sorter_icon{
                        font-size: 20px;
                    }
                }
            }
            .SST_header_filter_modal{
                position:absolute;
                bottom:0;
                left:0;
                z-index: 999;
            }
        }
      }
    }
    tbody{
      color:#57606F;
      tr{
          height: ${props => props.lineSpacing === "high" ? "70px" : props.lineSpacing === "medium" ? "50px" : "30px"};
          border-bottom: 1px solid #F0F0F0;
          &:hover{
            background: #F5F5F5 !important;
          }
          td{
              border-right: 1px solid #F0F0F0;
          }
      }
    }
    .footerTable{
      border-top: 1px solid rgba(22,125,255,0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 55px;
      color: #216A9A;
      select{
        background: none !important;
        min-width: fit-content;
      }
    }
  @media only screen and (max-width: 540px){
    table {
        th{
          white-space: nowrap;
        }
        tbody{
          td{
            white-space: nowrap;
          }
        }
    }
    .footerTable{
        flex-direction: column;
    }
  }
  .table-settings-dropdown{
    position: absolute;
    top: 30px;
    width: 300px;
    transform: translateX(-90%);
    color: #435F71;
    background-color: #fff;
    border: 1px solid #E7EAF3;
    box-shadow: 0 4px 4px rgba(#E7EAF3, .25);
    border-radius: 3px;
    overflow: hidden;
    z-index: 999;
    transition: height 300ms ease;
    &.dark{
        background-color: #141b24;
    }
    .menu-item{
        height: 35px;
        display: flex;
        align-items: center;
        border-radius: 3px;
        padding: 0.5rem;
        color: #435F71;
        width: 300px;
        font-size: 14px;
        cursor: pointer;
        &:hover{
            background-color: ${transparentize(.95, "#000")};
        }
    }
    .icon-button{
        font-size: 16px;
        padding-right: 10px;
    }
    .icon-right{
        position: absolute;
        right: 15px;
    }

    .menu-primary-enter{
        position: absolute;
        transform: translateX(-110%);
    }
    .menu-primary-enter-active{
        transform: translateX(-0%);
        transition: all 300ms ease;
    }
    .menu-primary-exit{
        position: absolute;

    }
    .menu-primary-exit-active{
        transform: translateX(-110%);
        transition: all 300ms ease;
    }

    .menu-secondary-enter{
        position: absolute;
        transform: translateX(110%);
    }
    .menu-secondary-enter-active{
        transform: translateX(-0%);
        transition: all 300ms ease;
    }
    .menu-secondary-exit-active{
        transform: translateX(110%);
        transition: all 300ms ease;
    }
  }

    @keyframes rotate{to{ transform: rotate(360deg); } }
    .spinner{ 
      display: inline-block;
      animation: rotate 1.5s linear infinite; 
      font-size: 20px;
    }
`

const ListItem = styled('div')<any>`
    width: max-content;
    padding: 5px 10px;
    box-sizing: border-box;
    font-size: 15px;
    margin-bottom: 5px;
    margin: 1px 10px;
    border: ${props => props.type === "top" && "1px solid #E1E1E1"};
    border-radius: 2px;
    color: #798c97;
    transition: all 200ms ease;
    position: relative;
    /* background:${props => props.type === "top" && "#FFF"}; */
    &:after{
        color: #798c97;
        border-right: 1px solid currentcolor;
        border-bottom: 1px solid currentcolor;
        content: '';
        position: absolute;
        top: 10px;
        right: -5px;
        width: 6px;
        height: 6px;
        transform: rotate(45deg)
    }
    .filterName{
        cursor: pointer;
    }
    &:hover{
        background: ${props => props.type === "left" && "rgba(33, 106, 154,.1)"};
        /* border: ${props => props.type === "top" && "1px solid #216A9A"}; */
        color: #216A9A;
    }
    .SST_list_filter_item_popup{
        width: ${props => props.filterParsedType==="rsql" ? "400px" : "300px"};
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        position: absolute;
        top: ${props => props.type === "left" ? "0px" : "110%"};
        left: ${props => props.isOnRightOfViewport ? "-310px" : props.type === "left" ? "105%" : "0"};
        z-index: 9999;
        padding: 10px;
        h4{
            font-weight: 400;
            color: #435F71 !important;
        }
    }
    .addFilter{
        clear: both;
        display: block;
        width: 40px;
        border: 1px solid #c8c8c8;
        background: #fff;
        color: #707070;
        border-radius: 2px;
        text-align: center;
        margin: 10px auto;
        position: relative;
        cursor: pointer;
        &:after{
            content:"";
            z-index: -1;
            width: 300px;
            height: 1px;
            background: #c8c8c8;
            position: absolute;
            display: block;
            top: 50%;
            left: -130px;
        }
    }
`

const FieldItem = styled('div')`
    padding: 0px 5px;
    @media (max-width: 1230px){
        width: 33% !important;
    }
    @media (max-width: 1150px){
        width: 50% !important;
    }
    @media (max-width: 820px){
        width: 100% !important;
    }
    @media (max-width: 540px){
        width: 100% !important;
    } 
`

const FilterContainer = styled('div')<{darkMode?: boolean, filterParsedType: filtersType}>`
    width: 100%;
    box-sizing: border-box;
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
    .inputs{
        display: flex;
        justify-content: space-between;
        input[type='text'], input[type='date'], input[type="number"]{
            height: ${props => props.filterParsedType === "rsql" ? "38px" : "35px"};
            line-height: ${props => props.filterParsedType === "rsql" ? "38px" : "35px"};
            width: ${props => props.filterParsedType=== "rsql" ? "350px" : "70%"};
            padding-left: 5px;
            float: right;
            margin-bottom: 10px;
            color: #435F71 !important;
        }

        .filterSelectChoice__control{
            width: 150px;
            border: .09rem solid #dbdee7;
            max-height: 35px;
        }
        .filterSelectChoice__value-container{
            max-height: 35px;
            overflow: hidden;
            flex-wrap: nowrap;
        }
        .filterSelectChoice__input{
            input{
                max-height: 25px !important;
                max-height: 25px !important;
                color: ${props => props.darkMode ? "#bccde0" : "initial"};
                margin-bottom: 0;
            }
        }
        .filterSelectChoice__control--is-focused{

        }
        .filterSelectChoice__indicator-separator{
            display: none;
        }
        .filterSelectChoice__single-value{
            color: ${props => props.darkMode ? "#bccde0" : "#initial"};
            font-size: 13px;
            font-weight: 500;
        }
        .filterSelectChoice__option{
            font-weight: 400;
        }
    }
`

const CheckContainer = styled('div')<{darkMode: boolean}>`
    max-height: 200px;
    overflow: auto;
    position: relative;
    z-index: 99;
    label{
        font-weight: 400;
    }
    .check-group{
        label{
            font-weight: 400;
            color: #435F71 !important;
            &:after{

                top: 2px;
            }
        }
    }
`

const FieldContainer = styled('div')<{darkMode: boolean}>`
    line-height: 38px;
    height: 38px;
    /* border: 1px solid #E0E0E0; */
    background:${props => props.darkMode ? "#272d3a" : "#ECECEC"};
    border-radius: 3px;
    label{
        margin-left: 3px;
    }
    @media(max-width: 820px){
        margin-bottom: 10px;
    }
`

const PerPageContainer = styled.div`
	float: right;
    transform: translateY(3px);
    padding-right: 10px;
	label{
		padding-right: 10px;
	}
	select{
		height: 40px;
		width: 20px;
	}
    .perPageSelect {
        color: #A3A6C0;
    }
`


const FiltersContainer = styled('div')<{darkMode: boolean}>`
    padding: 0 10px;
`

export {
    TableContainer,
    TableStyles,
    ListItem,
    FieldItem,
    FilterContainer,
    CheckContainer,
    FieldContainer,
    PerPageContainer,
    FiltersContainer
}