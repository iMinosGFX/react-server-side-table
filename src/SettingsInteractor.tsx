import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import {CSSTransition} from "react-transition-group"
import ColumnsSelector from './ColumnsSelector';
import { Translations } from './types/props';
import { translations } from './assets/translations';
import { LineSpacing } from './types/entities';
import { deleteKeyInDb } from './helpers/localDbManagement';

const Container = styled.div`
    position: relative;
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
     -khtml-user-select: none; 
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    i{
        border-radius: 3px;
        padding: 6px;
        transform: translateY(2px);
        transition: background 200ms;
        &:hover{
            background: rgba(0,0,0,.1);
            color: #3498db !important;
        }
    }
`

type Props = {
    columns: any[]
    hiddenColumns:string[]
    onHiddenColumnsChange(e:string[]): void
    onLineSpacingChange(e: LineSpacing): void
    translationsProps: Translations
    enabledExport?: boolean
    onExportClick?(): void
    darkMode: boolean
    tableId?:string
    lineSpacing: LineSpacing
    showVerticalBorders: boolean
    onShowVerticalBorderChange(e: boolean): void
}

const SettingsInteractor = (props: Props) => { 

    const node = React.useRef()
    const {translationsProps, enabledExport, onExportClick, darkMode, tableId, lineSpacing, showVerticalBorders, onShowVerticalBorderChange} = props
    const [open, setOpen] = useState<boolean>(false)


    const handleClick = e => {
      //@ts-ignore
      if (node.current && node.current.contains(e.target)) {
          return;
      }
      setOpen(false)
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return(
        <Container ref={node}>
            <i className="ri-equalizer-line" style={{fontSize: 18, color: "#828282", cursor: "pointer"}} onClick={() => setOpen(!open)}/>
            {open && <DropdownMenu 
                lineSpacing={lineSpacing}
                columns={props.columns} 
                hiddenColumns={props.hiddenColumns}
                onHiddenColumnsChange={(e) => props.onHiddenColumnsChange(e)} 
                onLineSpacingChange={e => props.onLineSpacingChange(e)}
                translationsProps={translationsProps}
                enabledExport={enabledExport}
                onExportClick={onExportClick}
                darkMode={darkMode}
                tableId={tableId}
                showVerticalBorders={showVerticalBorders}
                onShowVerticalBorderChange={onShowVerticalBorderChange}/>}
        </Container>
    )
}

type PropsDropdown = {
    ref?: any
    columns: string[]
    hiddenColumns: string[]
    onHiddenColumnsChange(e:string[]): void
    onLineSpacingChange(e: LineSpacing): void
    translationsProps: Translations
    enabledExport?: boolean
    onExportClick?(): void
    darkMode: boolean
    tableId?:string
    lineSpacing: LineSpacing
    showVerticalBorders: boolean
    onShowVerticalBorderChange(e: boolean): void
}

const DropdownMenu = (props: PropsDropdown) => {

    const {translationsProps, enabledExport, onExportClick, darkMode, tableId, lineSpacing, onLineSpacingChange, showVerticalBorders, onShowVerticalBorderChange} = props
    const [activeMenu, setActiveMenu] = useState<string>('main')
    const [menuHeight, setMenuHeight] = useState<any>(null)
    
    useEffect(() => {
        props.onLineSpacingChange(lineSpacing)
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

    const clearCache = () => {
        deleteKeyInDb(props.tableId)
        location.reload();
    }

    return(
        <div className={`table-settings-dropdown ${darkMode ? "dark" : ""}`}style={{height: menuHeight}}>
            <CSSTransition in={activeMenu === "main"} unmountOnExit timeout={200} classNames="menu-primary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={<i className="ri-eye-line" />}
                        rightIcon={<i className="ri-arrow-right-s-line" />}
                        goToMenu="columns">
                            {translationsProps?.settings?.toggleColumns ?? translations.settings.toggleColumns}
                    </DropdownItem>
                    <DropdownItem 
                        leftIcon={<i className="ri-line-height" />}
                        rightIcon={<i className="ri-arrow-right-s-line" />}
                        goToMenu="lineSpacing">
                            {translationsProps?.settings?.lineSpacing ?? translations.settings.lineSpacing}
                    </DropdownItem>
                    <DropdownItem
                            leftIcon={<i className="ri-delete-back-2-line" />}>
                            <span onClick={clearCache}>{translationsProps?.settings?.clearCache ?? translations.settings.clearCache} </span>
                    </DropdownItem>
                    {enabledExport && 
                        <DropdownItem
                            leftIcon={<i className="ri-file-download-line" />}>
                            <span onClick={onExportClick}>{translationsProps?.settings?.export ?? translations.settings.export} </span>
                        </DropdownItem>
                    }
                </div>
            </CSSTransition>
            <CSSTransition in={activeMenu === "columns"} unmountOnExit timeout={200} classNames="menu-secondary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={<i className="ri-arrow-left-s-line"/>}
                        goToMenu="main">
                        {translationsProps?.settings?.back ?? translations.settings.back}
                    </DropdownItem>
                    <ColumnsSelector 
                        columns={props.columns} 
                        onChange={(e: string[]) => props.onHiddenColumnsChange(e)} 
                        hiddenColumns={props.hiddenColumns}
                        tableId={tableId}/>
                </div>
            </CSSTransition>
            <CSSTransition in={activeMenu === "lineSpacing"} unmountOnExit timeout={200} classNames="menu-secondary" onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem 
                        leftIcon={<i className="ri-arrow-left-s-line"/>}
                        goToMenu="main">
                        {translationsProps?.settings?.back ?? translations.settings.back}
                    </DropdownItem>
                    <div style={{paddingTop: 10}}></div>
                        <label className="radio-container" key="settings_radio_high">
                            <input type="radio" id={`radio_type_settings_radio_high`} name={`radio_type_settings_radio_high`} value={'high'} checked={lineSpacing === 'high'} onChange={() => onLineSpacingChange('high')}/>
                            <span>{translationsProps?.settings?.highHeight ?? translations.settings.highHeight}</span>
                        </label>
                        <div style={{paddingTop: 5}}></div>
                        <label className="radio-container" key="settings_radio_medium">
                            <input type="radio" id={`radio_type_settings_radio_medium`} name={`radio_type_settings_radio_medium`} value={'medium'} checked={lineSpacing === 'medium'} onChange={() => onLineSpacingChange('medium')}/>
                            <span>{translationsProps?.settings?.mediumHeight ?? translations.settings.mediumHeight}</span>
                        </label>
                        <div style={{paddingTop: 5}}></div>
                        <label className="radio-container" key="settings_radio_small">
                            <input type="radio" id={`radio_type_settings_radio_small`} name={`radio_type_settings_radio_small`} value={'small'} checked={lineSpacing === 'small'} onChange={() => onLineSpacingChange('small')}/>
                            <span>{translationsProps?.settings?.smallHeight ?? translations.settings.smallHeight}</span>
                        </label>
                    
                        <div className="check-group" style={{paddingTop: 10, paddingLeft: 10}}>
                            <input 
                                type="checkbox" 
                                name="SST_Vertical_Border_Checkbox" 
                                id="SST_Vertical_Border_Checkbox"
                                onChange={() => onShowVerticalBorderChange(!showVerticalBorders)} 
                                checked={showVerticalBorders}/>
                            <label htmlFor="SST_Vertical_Border_Checkbox">Afficher bordures verticales</label>
                        </div>
                    <div style={{paddingTop: 10}}></div>
                </div>
            </CSSTransition>
        </div>
    )
}

export default SettingsInteractor