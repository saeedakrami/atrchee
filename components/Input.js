import React, {useState, useEffect} from 'react';
import {isMobile} from 'react-device-detect';

const Input = (props) => {

    const [value, setValue] = useState(props.value || props.defaultValue);
    const [passwordShown, setPasswordShown] = useState(false);
    const [error, setError] = useState(null);
    const [focus, setFucos] = useState(false);

    useEffect(() => {
        setError(props.error)
    }, [props.error]);

    useEffect(()=> {
        setValue(props.value || props.defaultValue || '')
    }, [props.value, props.defaultValue])

    function onChange(e) {
        setValue(e.target.value);
        props.onChange(e);
    }

    function togglePasswordVisibility() {
        setPasswordShown(!passwordShown)
    }

    function inputFocus(e) {
        setFucos(true);
        if (isMobile) {
            window.scrollTo({
                top: window.scrollY + e.target.getBoundingClientRect().top - 10,
                behavior: "smooth"
            });
        }
    }


    return (
        <>
            <div className={`select-container rounded-md ${error ? 'select-container-error ': ''} ${props.disabled ? 'select-container-disabled ' : ''}`}>
                {(props.innerLabel && (value || focus)) && (
                    <div className={`inline-label ${error ? 'error ' : ''} ${props.disabled ? 'disabled ' : ''}`}>
                        <span>{props.placeholder}</span>
                    </div>
                )}
                <input
                    className={`px-4 rounded-md ${props.disabled ? 'disabled' : ''} ${props.className}`}
                    id={props.id}
                    name={props.name}
                    value={value}
                    // defaultValue={props.dafaultValue}
                    type={props.type === "password" ? passwordShown ? "text" : "password": props.type}
                    placeholder={props.placeholder}
                    onChange={onChange}
                    onWheel={(e)=>e.preventDefault()}
                    disabled={props.disabled}
                    onFocus={inputFocus}
                    onBlur={()=>setFucos(false)}
                />
                <div className="input-left-div">
                    {props.type === "password" && (
                        <span 
                            className="font-regular size-11 gray pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {!passwordShown ? 'نمایش' : 'عدم نمایش'}
                        </span>
                    )}
                    {error  && (
                        <i class="fas fa-exclamation-circle error mr-2"></i>
                    )}
                    {(props.clearIconClick && value && !error) && (
                        <span className="far fa-times-circle gray" onClick={()=> props.clearIconClick(props.name)} />
                    )}
                </div>
            </div>
            {error && (
                <span className="error input-error-span size-9">{error}</span>
            )}
        </>
    );
}
 
export default Input;