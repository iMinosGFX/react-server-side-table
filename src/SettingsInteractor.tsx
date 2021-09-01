import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH, faEye, faChevronRight, faChevronLeft, faTextWidth, faFileExport } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import {CSSTransition} from "react-transition-group"
import ColumnsSelector from './ColumnsSelector';
import { saveLineSpacing, getLineSpacing } from './helpers/SSTlocalStorageManagement';

const Container = styled.div`
    position: relative;
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
     -khtml-user-select: none; 
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    span{
        padding: 10px;
        border-radius: 50%;
        transition: background 200ms;
        svg{
            transform: translateY(2px);
        }
        &:hover{
            background: rgba(0,0,0,.1)
        }
    }
`

type Props = {
    columns: any[]
    hiddenColumns:string[]
    onHiddenColumnsChange(e:string[]): void
    onLineSpacingChange(e: string): void
}

const SettingsInteractor = (props: Props) => { 

    const [open, setOpen] = useState<boolean>(false)

    return(
        <Container>
            <span onClick={() => setOpen(!open)}><FontAwesomeIcon icon={faSlidersH} style={{fontSize: 18, color: "#828282", cursor: "pointer"}} /></span>
            {open && <DropdownMenu 
                columns={props.columns} 
                hiddenColumns={props.hiddenColumns}
                onHiddenColumnsChange={(e) => props.onHiddenColumnsChange(e)} 
                onLineSpacingChange={e => props.onLineSpacingChange(e)}/>}
        </Container>
    )
}

type PropsDropdown = {
    ref?: any
    columns: string[]
    hiddenColumns: string[]
    onHiddenColumnsChange(e:string[]): void
    onLineSpacingChange(e: string): void
}

const DropdownMenu = (props: PropsDropdown) => {

    const [activeMenu, setActiveMenu] = useState<string>('main')
    const [menuHeight, setMenuHeight] = useState<any>(null)
    const [lineSpacing, setLineSpacing] = useState<string>(getLineSpacing())
    
    useEffect(() => {
        props.onLineSpacingChange(lineSpacing)
        saveLineSpacing(lineSpacing)
    }, [lineSpacing])

    function calcHeight(el){
        const height = el.offsetHeight
        setMenuHeight(height)
    }

    function DropdownItem(props: any){
        return(
            <span className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
                {!!props.leftIcon && <span className="icon-button"><FontAwesomeIcon icon={props.leftIcon}/></span>}
                {props.children}
                {!!props.rightIcon && <span className="icon-right"><FontAwesomeIcon icon={props.rightIcon}/></span>}
            </span>
        )
    }

    return(
        <div className="table-settings-dropdown" style={{height: menuHeight}}>
            <CSSTransition in={activeMenu === "main"} unmountOnExit timeout={200} classNames="menu-primary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={faEye} 
                        rightIcon={faChevronRight}
                        goToMenu="columns">
                            Afficher / Masquer colonnes
                    </DropdownItem>
                    <DropdownItem 
                        leftIcon={faTextWidth} 
                        rightIcon={faChevronRight}
                        goToMenu="lineSpacing">
                            Comfort d'affichage
                    </DropdownItem>
                    <DropdownItem 
                        leftIcon={faFileExport}>
                            Export
                    </DropdownItem>
                </div>
            </CSSTransition>
            <CSSTransition in={activeMenu === "columns"} unmountOnExit timeout={200} classNames="menu-secondary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={faChevronLeft}
                        goToMenu="main">
                            Retour
                    </DropdownItem>
                    <ColumnsSelector columns={props.columns} onChange={(e: string[]) => props.onHiddenColumnsChange(e)} hiddenColumns={props.hiddenColumns}/>
                </div>
            </CSSTransition>
            <CSSTransition in={activeMenu === "lineSpacing"} unmountOnExit timeout={200} classNames="menu-secondary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={faChevronLeft}
                        goToMenu="main">
                            Retour
                    </DropdownItem>
                    <div style={{paddingTop: 10}}></div>
                    <label className="radio-container" key="settings_radio_high">
                        <input type="radio" id={`radio_type_settings_radio_high`} name={`radio_type_settings_radio_high`} value={'high'} checked={lineSpacing === 'high'} onChange={() => setLineSpacing('high')}/>
                        <span>Grande hauteur</span>
                    </label>
                    <div style={{paddingTop: 5}}></div>
                    <label className="radio-container" key="settings_radio_medium">
                        <input type="radio" id={`radio_type_settings_radio_medium`} name={`radio_type_settings_radio_medium`} value={'medium'} checked={lineSpacing === 'medium'} onChange={() => setLineSpacing('medium')}/>
                        <span>Hauteur moyenne</span>
                    </label>
                    <div style={{paddingTop: 5}}></div>
                    <label className="radio-container" key="settings_radio_small">
                        <input type="radio" id={`radio_type_settings_radio_small`} name={`radio_type_settings_radio_small`} value={'small'} checked={lineSpacing === 'small'} onChange={() => setLineSpacing('small')}/>
                        <span>Petite hauteur</span>
                    </label>
                    <div style={{paddingTop: 10}}></div>
                </div>
            </CSSTransition>
        </div>
    )
}

export default SettingsInteractor