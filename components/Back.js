import React from 'react';

const Back = (props) => {
    return (
        <div className="back size-14 mt-16" onClick={props.onClick}>
            <span className="fa fa-arrow-right size-10 ml-1" />
            <span>بازگشت</span>
        </div>
    );
}
 
export default Back;