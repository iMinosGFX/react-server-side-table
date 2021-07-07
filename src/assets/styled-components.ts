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
    color: #435F71;
    select{
      background: none !important;
      min-width: fit-content;
    }
  }
  @media only screen and (max-width: 540px){
    table{
      display: block;
      overflow-x: auto;
      white-space: nowrap;
      th{
        white-space: nowrap;
      }
      tbody{
        td{
          white-space: nowrap;
        }
      }
    }
  }
`

export {
    TableStyles
  }