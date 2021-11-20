import React from 'react';
import Loading from "./Loading";

const Button = (props) => {
    return (
        <div className="md:w-full">
            <button
                style={{height: props.height ? props.height : "41px"}}
                className={`w-full rounded-md ${props.secondaryButton ? "text-atrcheeViolet border-atrcheeViolet border-2" : "text-white bg-atrcheeViolet"} ${props.className}`}
                type="submit"
                children={props.loading ? <Loading loading={props.loading}/> : props.text}
            />
        </div>
    );
}
 
export default Button;