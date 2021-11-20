import React, {useState, useEffect} from 'react';
import {isMobile} from 'react-device-detect';

const AutocompleteInput = (props) => {

    const [showData, setShowData] = useState(false);
    const [filterData, setFilterData] = useState({});
    const [index, setIndex] = useState(parseInt(-1));

    useEffect (()=>{
        setFilterData(props.data)
    }, [])

    function handleInputChange(e) {
        let filtered = {}
        Object.entries(props.data).map(([id,name]) => {
                if (name.indexOf(e.target.value) !== -1) {
                    filtered[id] = name 
                }
        })
        setFilterData(filtered);
    }

    function selectOptions(e) {
        props.selectOptions(e.target, props.name)
        setShowData(false)
        setFilterData(props.data)
    }

    function closeModal() {
        setShowData(false)
        setFilterData(props.data)
    }

    function openModal() {
        setShowData(true);
        setTimeout(() => {
            let elem = document.getElementById('option_items');
            if (elem) elem.focus();
        },100)
    }

    function inputFocus(e) {
        if (isMobile) {
            window.scrollTo({
                top: window.scrollY + e.target.getBoundingClientRect().top - 50,
                behavior: "smooth"
            });
        }
    }

    function keyDown(e) {
        if(e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === "Enter") {
            e.preventDefault();
            let tabIndex = index;
            let allItems = document.querySelectorAll("[tabIndex]");
            let focusItem;
            if(e.key === 'ArrowDown') {
                tabIndex++;
                if (tabIndex > allItems.length-2) tabIndex = 0;
            }
            else if (e.key === 'ArrowUp') {
                tabIndex--;
                if (tabIndex === -1) tabIndex = allItems.length-2;
            }
            setIndex(tabIndex)
            allItems.forEach(item=> {
                if(item.getAttribute('tabIndex') === tabIndex.toString()) {
                    item.focus();
                    focusItem = item;
                }
            })
            if (e.key === "Enter") {
                if (tabIndex !== -1) {
                    props.selectOptions(focusItem, props.name)
                    setShowData(false)
                    setFilterData(props.data)
                }
            }
        }
    }

    return (
        <>
            <div className="select-container rounded-md">
                <div className={`input-div px-4 ${!props.defaultValue && "placeholder"}`} onClick={openModal}>
                    {props.defaultValue ? props.defaultValue : props.placeholder}
                </div>
                <div className="input-left-div">
                    <span className={`fa ${showData ? 'fa-chevron-up': 'fa-chevron-down'} light-gray size-14`} />
                </div>
            </div>
            {showData && (
                <>
                    <div className="modal-container" onClick={closeModal}></div>
                    <div className="option-modal" onKeyDown={keyDown}>
                        <div className="select-container">
                            <span className="" />
                            <input 
                                id={props.id} 
                                autoComplete="off"
                                name={props.name}
                                onFocus={inputFocus}
                                onInput={handleInputChange}
                                className='px-4'
                                placeholder="جستجو ..."  
                            />
                        </div>
                        <div id="option_items" tabIndex="-1" className="option-modal-items">
                            {Object.entries(filterData).map(([id, name], i) => (
                                <div tabIndex={i} className={`option-item ${name === props.defaultValue && 'selected'}`} key={id} value={id} onClick={selectOptions}>
                                    {name}
                                </div>
                            ))}
                        </div>
                   </div>
                </>
            )}
        </>
    );
}
 
export default AutocompleteInput;