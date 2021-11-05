import styled from 'styled-components'
import { FiltersPosition } from '../ServerSideTable'

const TableStyles = styled("div")<{lineSpacing: string, darkMode: boolean}>`
  table {
    border-spacing: 0;
    width:100%;
      thead{
        text-align:left;
        padding:0 40px;
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
    th{
      white-space: nowrap;
    }
    tbody{
      td{
        white-space: nowrap;
      }
    }
  }
  .table-settings-dropdown{
    position: absolute;
    top: 30px;
    width: 300px;
    transform: translateX(-90%);
    background-color: #fff;
    box-shadow: $shadow-xl;
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
        color: $gray-medium;
        width: 300px;
        font-size: 14px;
        cursor: pointer;
        &:hover{
            background-color: transparentize($primary, 0.8)
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
    .filterPopup{
        width: 300px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        position: absolute;
        top: ${props => props.type === "left" ? "0px" : "110%"};
        left: ${props => props.type === "left" ? "105%" : "0"};
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

const FieldItem = styled('div')<{widthPercentage?: number}>`
    width: ${props => !!props.widthPercentage ? `${props.widthPercentage}%`: "33%"};
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

const FilterContainer = styled('div')<{filtersPosition:FiltersPosition, darkMode?: boolean}>`
    width: 100%;
    box-sizing: border-box;
    padding: ${props => props.filtersPosition === "list" ? "8px 5px" : "0"};
    margin:  ${props => props.filtersPosition === "list" ? "10px 0" : "0 0 10px 0"};
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
        display: ${props => props.filtersPosition === "list" ? "block" : "flex"};
        input[type='text'], input[type='date'], input[type="number"]{
            background: ${props => props.darkMode ? "#272d3a" : "#ECECEC"};
            height: ${props => props.filtersPosition === "list" ? "35px" : "38px"};
            line-height: ${props => props.filtersPosition === "list" ? "35px" : "38px"};
            border: ${props => props.filtersPosition === "list" ? "1px solid #E0E0E0" : "initial"};
            width: ${props => props.filtersPosition === "list" ? "70%" : "100%"};
            padding-left: 5px;
            float: right;
            margin-bottom: ${props => props.filtersPosition === "list" ? "10px" : "initial"};
            color: #435F71 !important;
        }

        .filterSelectChoice__control{
            border: none;
            margin-bottom: ${props => props.filtersPosition === "list" ? "10px" : "initial"};
            width: ${props => props.filtersPosition === "field" ? "155px" : "initial"};
            background: ${props => props.darkMode ? "#141b24" : "#e3e3e3"};
            border-radius: 2px 0 0 2px;
        }
        .filterSelectChoice__control--is-focused{
            border:none;
            box-shadow: none;
        }
        .filterSelectChoice__indicator-separator{
            display: none;
        }
        .filterSelectChoice__single-value{
            color: ${props => props.darkMode ? "#bccde0" : "#initial"};
        }
        .filterSelectChoice__input{
            input{
                color: ${props => props.darkMode ? "#bccde0" : "#initial"};
                height: 1.2rem !important;
                font-size: 15px !important;
            }
        }
    }
`

const CheckContainer = styled('div')<{filtersPosition: FiltersPosition, darkMode: boolean}>`
    max-height: 200px;
    overflow: auto;
    position: relative;
    z-index: 99;
    background:${props => props.filtersPosition === "field" ? props.darkMode ? "#272d3a" : "#ECECEC" : "initial"};
    box-shadow: ${props => props.filtersPosition === "field" ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "initial"};
    .check-group{
        label{
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

export {
  TableStyles,
  ListItem,
  FieldItem,
  FilterContainer,
  CheckContainer,
  FieldContainer
}