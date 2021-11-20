import React, {useState, useEffect} from 'react';

const Input = (props) => {

    const [value, setValue] = useState(props.value);
    const [passwordShown, setPasswordShown] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(props.error)
      }, [props.error]);

      useEffect(() => {
        setValue(props.value)
      }, [props.value]);

    function onChange(e) {
        setValue(e.target.value);
        props.onChange(e);
    }


    return (
        <>
            <div className={`textarea-container rounded-md ${error ? 'select-container-error': ''}`}>
                {props.innerLabel && (
                    <div className={`inline-label ${error ? 'error' : ''}`}>
                        <span>{props.innerLabel}</span>
                    </div>
                )}
                <textarea
                    className={`p-4 rounded-md ${props.className}`}
                    id={props.id}
                    name={props.name}
                    defaultValue={props.value}
                    placeholder={props.placeholder}
                    onChange={onChange}
                />
                <div className="input-left-div">
                    {error  && (
                        <i class="fas fa-exclamation-circle error"></i>
                    )}
                    {(props.clearIconClick && value && !error) && (
                        <span className="far fa-times-circle gray" onClick={()=> props.clearIconClick(props.name)} />
                    )}
                </div>
            </div>
            {error && (
                <span className="error size-9">{error}</span>
            )}
        </>
    );
}
 
export default Input;