import styled from 'styled-components'

const TableStyles = styled("div")<{lineSpacing: string}>`
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
            background-color: "#F5F5F5";
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

export {
    TableStyles
  }