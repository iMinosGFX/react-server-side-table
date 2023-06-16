import React from "react"

type Props = {
    id: string
    name?:string
    containerStyle?: React.CSSProperties
    containerClassName?: string 
    label: string | JSX.Element
    onChange?: () => void
    [e: string]: any
    value?: any
    rhfRegister?: any
    isInderterminate?: boolean
    disabled?: boolean
    checked?: boolean
}

const Checkbox = (props: Props): JSX.Element => {

    const {id, containerStyle, containerClassName, label, value, onChange, checked, rhfRegister, isInderterminate, disabled} = props

    return(
    <div className={`check-group ${!!containerClassName ? containerClassName : ""} ${isInderterminate ? "indeterminate" : "not-indeterminate"} ${!!disabled ? "disabled" : ""}`} style={containerStyle}>
        <input 
            type="checkbox" 
            id={id}
            value={value}
            disabled={disabled}
            onChange={!disabled && onChange}
            checked={checked}
            {...rhfRegister}/>
        <label htmlFor={id}>{label}</label>
    </div>
    )
}

export default Checkbox