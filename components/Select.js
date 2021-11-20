import React, {useState} from 'react';

const Select = (props) => {

    const [value, setValue] = useState(props.value);

    function onChange(e) {
        setValue(e.target.value);
        props.onChange(e);
    }

    return (
        <div className={"select-container rounded-md " + props.className}>
            {value !== "" && (
                <div className="inline-label">
                    <span>{props.label}</span>
                </div>
            )}
            <select 
                className="px-4 rounded-md" 
                id={props.id}
                name={props.name}
                value={props.value} 
                onChange={onChange}
            >
                {props.options && props.options.map(option => (
                    <option value={option.value} hidden={option.hidden}>{option.text}</option>
                ))}
            </select>
            <span className={"fa fa-chevron-down light-gray small " + props.arrowClass} />
        </div>
    );
}
 
export default Select;