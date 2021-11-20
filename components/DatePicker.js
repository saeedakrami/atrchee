import React from 'react'
import DatePicker2 from 'react-datepicker2';
import momentJalali from "moment-jalaali";

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: momentJalali(),
            isGregorian: false,
            disableRange:momentJalali().add(-1,'days'),
            firstTime :true

        }
    }



    render() {
        const { onChange } = this.props

        if (this.state.firstTime){
            this.setState({firstTime:false},()=>{
                onChange(this.state.value)
            })
        }
        //

        return (
            <DatePicker2
            showTodayButton={false}
            persianDigits={true}
            min={this.state.disableRange}
            isGregorian={this.state.isGregorian}
            onChange={(v)=>{
                //this.setState({vlaue:v})
                onChange(v)
            }}
            value={this.state.value}
            timePicker={true}
        />
        )
    }
}

export default DatePicker