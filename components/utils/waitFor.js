

import React from 'react'
//import loading from '../../images/pakat_logo_favicon.png'



export default class WithLoading extends React.Component {
    constructor(props) {
        super(props);
        this.retry_scheduler = this.retry_scheduler.bind(this)
    }
    isFirstRender = true;
    isLoded = false;
    retry = () => { };
    retry_scheduler = () => {
        if (!this.isLoded) {

            this.retry()
            setTimeout(this.retry_scheduler, 6000)
        }
    }
    render() {

        if (this.props.waitFor) {
            this.isLoded = true
            return this.props.children

        } else {
            if (this.isFirstRender && this.props.retry) {
                setTimeout(this.retry_scheduler, 8000)
                this.retry = this.props.retry
                this.isFirstRender = false
            }

            return (
                <div className='loader2' style={this.props.style}>
                    <div />
                    <br /><br /><br />

                </div>
            )
        }
    }
}