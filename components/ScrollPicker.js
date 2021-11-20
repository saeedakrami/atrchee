import React, {useState, useEffect} from 'react';

const ScrollPicker = (props) => {
    const [translate, setTranslate] = useState(0);
    const [selected, setSelected] = useState(null);
    const [clientY, setClientY] = useState(0);
    useEffect(()=> {
        props.optionGroups.map((option,i)=> {
            if (option === props.valueGroups) {
                setTranslate(props.itemHeight * i * -1 + props.itemHeight)
                setSelected(option);
            }
        })
    }, [])
    function handleWheel(e) {
        let y = e.deltaY;
        let endTranslate = (props.optionGroups.length - 2) * props.itemHeight * -1;
        let selectedIndex = props.optionGroups.indexOf(selected);
        if(y>0 && translate<props.itemHeight){
            setTranslate(translate + props.itemHeight);
            setSelected(props.optionGroups[selectedIndex-1]);
            props.onChange(props.name,props.optionGroups[selectedIndex-1]);
        }else if(y<0 && translate>endTranslate) {
            setTranslate(translate - props.itemHeight);
            setSelected(props.optionGroups[selectedIndex+1]);
            props.onChange(props.name,props.optionGroups[selectedIndex+1]);
        }
    }

    function handleClick(i) {
        setTranslate(props.itemHeight * i * -1 + props.itemHeight);
        setSelected(props.optionGroups[i]);
        props.onChange(props.name,props.optionGroups[i]);
    }

    function handleTouchStart(e) {
        setClientY(e.touches[0].clientY);
    }

    function handleTouchMove(e) {
        let y = e.touches[0].clientY - clientY;
        let endTranslate = (props.optionGroups.length - 2) * props.itemHeight * -1;
        let selectedIndex = props.optionGroups.indexOf(selected);
        if(y>10 && translate<props.itemHeight){
            setTranslate(translate + props.itemHeight);
            setSelected(props.optionGroups[selectedIndex-1]);
            setClientY(e.touches[0].clientY);
            props.onChange(props.name,props.optionGroups[selectedIndex-1]);
        }else if(y<-10 && translate>endTranslate) {
            setTranslate(translate - props.itemHeight);
            setSelected(props.optionGroups[selectedIndex+1]);
            props.onChange(props.name,props.optionGroups[selectedIndex+1]);
            setClientY(e.touches[0].clientY);
        }
    }

    return (
        <>
            <div className="scroll-picker-container" style={{height: props.height + 'px'}}>
                <div className="scroll-picker-column">
                    <div className="scroll-picker-scroller" style={{transform: `translate(0, ${translate}px)`}} onWheel={handleWheel} onTouchMove={handleTouchMove} onTouchStart={handleTouchStart}>
                        {props.optionGroups.map((option,i) => (
                            <div 
                                className={`scroll-picker-item ${selected === option ? 'scroll-picker-item-selected': ''}`} 
                                style={{height: props.itemHeight + 'px', lineHeight: props.itemHeight + 'px'}}
                                key={option}
                                onClick={()=> handleClick(i)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="selected-birthday-flag" />
        </>
    );
}
 
export default ScrollPicker;