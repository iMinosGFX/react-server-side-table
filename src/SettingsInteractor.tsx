import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import {CSSTransition} from "react-transition-group"
import ColumnsSelector from './ColumnsSelector';
import { saveLineSpacing, getLineSpacing, getFilterType, saveFilterType } from './helpers/SSTlocalStorageManagement';
import { FaSlidersH, FaChevronRight, FaEye, FaTextWidth, FaChevronLeft, FaFileExport } from 'react-icons/fa';
import { Translations } from './types/props';
import { translations } from './assets/translations';
import { IoFilterSharp } from 'react-icons/io5';
import {ImTextHeight} from "react-icons/im"
import { AiOutlineEye } from 'react-icons/ai';

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
    onFilterTypeChange(e: string): void
    filterType: string
    translationsProps: Translations
    enabledExport?: boolean
    onExportClick?(): void
    darkMode: boolean
}

const SettingsInteractor = (props: Props) => { 

    const {translationsProps, enabledExport, onExportClick, filterType, darkMode} = props
    const [open, setOpen] = useState<boolean>(false)

    return(
        <Container>
            <span onClick={() => setOpen(!open)}><FaSlidersH style={{fontSize: 18, color: "#828282", cursor: "pointer"}} /></span>
            {open && <DropdownMenu 
                columns={props.columns} 
                hiddenColumns={props.hiddenColumns}
                onHiddenColumnsChange={(e) => props.onHiddenColumnsChange(e)} 
                onLineSpacingChange={e => props.onLineSpacingChange(e)}
                onFilterTypeChange={e => props.onFilterTypeChange(e)}
                translationsProps={translationsProps}
                enabledExport={enabledExport}
                filterType={filterType}
                onExportClick={onExportClick}
                darkMode={darkMode}/>}
        </Container>
    )
}

type PropsDropdown = {
    ref?: any
    columns: string[]
    hiddenColumns: string[]
    onHiddenColumnsChange(e:string[]): void
    onLineSpacingChange(e: string): void
    onFilterTypeChange(e: string): void
    filterType: string
    translationsProps: Translations
    enabledExport?: boolean
    onExportClick?(): void
    darkMode: boolean
}

const DropdownMenu = (props: PropsDropdown) => {

    const {translationsProps, enabledExport, onExportClick, filterType, darkMode} = props
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
        <div className={`table-settings-dropdown ${darkMode ? "dark" : ""}`}style={{height: menuHeight}}>
            <CSSTransition in={activeMenu === "main"} unmountOnExit timeout={200} classNames="menu-primary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={<AiOutlineEye />}
                        rightIcon={<FaChevronRight />}
                        goToMenu="columns">
                            {translationsProps?.settings?.toggleColumns ?? translations.settings.toggleColumns}
                    </DropdownItem>
                    <DropdownItem 
                        leftIcon={<ImTextHeight />}
                        rightIcon={<FaChevronRight />}
                        goToMenu="lineSpacing">
                            {translationsProps?.settings?.lineSpacing ?? translations.settings.lineSpacing}
                    </DropdownItem>
                    <DropdownItem 
                        leftIcon={<IoFilterSharp />}
                        rightIcon={<FaChevronRight />}
                        goToMenu="filterType">
                            {translationsProps?.settings?.filterType ?? translations.settings.filterType}
                    </DropdownItem>
                    {enabledExport && 
                        <DropdownItem
                            leftIcon={<FaFileExport />}>
                            <span onClick={onExportClick}>{translationsProps?.settings?.export ?? translations.settings.export} </span>
                        </DropdownItem>
                    }
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
            <CSSTransition in={activeMenu === "filterType"} unmountOnExit timeout={200} classNames="menu-secondary" onEnter={calcHeight}>
            <div className="menu">
                    <DropdownItem 
                        leftIcon={<FaChevronLeft/>}
                        goToMenu="main">
                        {translationsProps?.settings?.back ?? translations.settings.back}
                    </DropdownItem>
                    <div style={{paddingTop: 10}}></div>
                    <label className="radio-container" key="settings_radio_field">
                        <input type="radio" id={`radio_type_settings_radio_field`} name={`radio_type_settings_radio_field`} value={'field'} checked={filterType === 'field'} onChange={() => {props.onFilterTypeChange('field'); saveFilterType('field')}}/>
                        <span>{translationsProps?.settings?.filterField ?? translations.settings.filterField}</span>
                    </label>
                    <div style={{paddingTop: 5}}></div>
                    <label className="radio-container" key="settings_radio_list">
                        <input type="radio" id={`radio_type_settings_radio_list`} name={`radio_type_settings_radio_list`} value={'list'} checked={filterType === 'list'} onChange={() => {props.onFilterTypeChange('list'); saveFilterType('list')}}/>
                        <span>{translationsProps?.settings?.filterList ?? translations.settings.filterList}</span>
                    </label>
                    <div style={{paddingTop: 10}}></div>
                </div>
            </CSSTransition>
        </div>
    )
}

export default SettingsInteractor