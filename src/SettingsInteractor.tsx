import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import {CSSTransition} from "react-transition-group"
import ColumnsSelector from './ColumnsSelector';
import { saveLineSpacing, getLineSpacing } from './helpers/SSTlocalStorageManagement';
import { FaSlidersH, FaChevronRight, FaEye, FaTextWidth, FaChevronLeft, FaFileExport } from 'react-icons/fa';
import { Translations } from './types/props';
import { translations } from './assets/translations';

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
    translationsProps: Translations
}

const SettingsInteractor = (props: Props) => { 

    const {translationsProps} = props
    const [open, setOpen] = useState<boolean>(false)

    return(
        <Container>
            <span onClick={() => setOpen(!open)}><FaSlidersH style={{fontSize: 18, color: "#828282", cursor: "pointer"}} /></span>
            {open && <DropdownMenu 
                columns={props.columns} 
                hiddenColumns={props.hiddenColumns}
                onHiddenColumnsChange={(e) => props.onHiddenColumnsChange(e)} 
                onLineSpacingChange={e => props.onLineSpacingChange(e)}
                translationsProps={translationsProps}/>}
        </Container>
    )
}

type PropsDropdown = {
    ref?: any
    columns: string[]
    hiddenColumns: string[]
    onHiddenColumnsChange(e:string[]): void
    onLineSpacingChange(e: string): void
    translationsProps: Translations
}

const DropdownMenu = (props: PropsDropdown) => {

    const {translationsProps} = props
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
                {!!props.leftIcon && <span className="icon-button">{props.leftIcon}</span>}
                {props.children}
                {!!props.rightIcon && <span className="icon-right">{props.rightIcon}</span>}
            </span>
        )
    }

    return(
        <div className="table-settings-dropdown" style={{height: menuHeight}}>
            <CSSTransition in={activeMenu === "main"} unmountOnExit timeout={200} classNames="menu-primary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={<FaEye />}
                        rightIcon={<FaChevronRight />}
                        goToMenu="columns">
                            {translationsProps?.settings?.toggleColumns ?? translations.settings.toggleColumns}
                    </DropdownItem>
                    <DropdownItem 
                        leftIcon={<FaTextWidth />}
                        rightIcon={<FaChevronRight />}
                        goToMenu="lineSpacing">
                            {translationsProps?.settings?.lineSpacing ?? translations.settings.lineSpacing}
                    </DropdownItem>
                    <DropdownItem 
                        leftIcon={<FaFileExport />}>
                        {translationsProps?.settings?.export ?? translations.settings.export}
                    </DropdownItem>
                </div>
            </CSSTransition>
            <CSSTransition in={activeMenu === "columns"} unmountOnExit timeout={200} classNames="menu-secondary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={<FaChevronLeft/>}
                        goToMenu="main">
                        {translationsProps?.settings?.back ?? translations.settings.back}

                    </DropdownItem>
                    <ColumnsSelector columns={props.columns} onChange={(e: string[]) => props.onHiddenColumnsChange(e)} hiddenColumns={props.hiddenColumns}/>
                </div>
            </CSSTransition>
            <CSSTransition in={activeMenu === "lineSpacing"} unmountOnExit timeout={200} classNames="menu-secondary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={<FaChevronLeft/>}
                        goToMenu="main">
                        {translationsProps?.settings?.back ?? translations.settings.back}
                    </DropdownItem>
                    <div style={{paddingTop: 10}}></div>
                    <label className="radio-container" key="settings_radio_high">
                        <input type="radio" id={`radio_type_settings_radio_high`} name={`radio_type_settings_radio_high`} value={'high'} checked={lineSpacing === 'high'} onChange={() => setLineSpacing('high')}/>
                        <span>{translationsProps?.settings?.highHeight ?? translations.settings.highHeight}</span>
                    </label>
                    <div style={{paddingTop: 5}}></div>
                    <label className="radio-container" key="settings_radio_medium">
                        <input type="radio" id={`radio_type_settings_radio_medium`} name={`radio_type_settings_radio_medium`} value={'medium'} checked={lineSpacing === 'medium'} onChange={() => setLineSpacing('medium')}/>
                        <span>{translationsProps?.settings?.mediumHeight ?? translations.settings.mediumHeight}</span>
                    </label>
                    <div style={{paddingTop: 5}}></div>
                    <label className="radio-container" key="settings_radio_small">
                        <input type="radio" id={`radio_type_settings_radio_small`} name={`radio_type_settings_radio_small`} value={'small'} checked={lineSpacing === 'small'} onChange={() => setLineSpacing('small')}/>
                        <span>{translationsProps?.settings?.smallHeight ?? translations.settings.smallHeight}</span>
                    </label>
                    <div style={{paddingTop: 10}}></div>
                </div>
            </CSSTransition>
        </div>
    )
}

export default SettingsInteractor