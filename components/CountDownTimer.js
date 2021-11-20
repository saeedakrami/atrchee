import React, {Fragment} from 'react'

class CountDownTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: {
                minutes: 0,
                seconds: 0,
            },
            duration: 2 * 60 * 1000,
            timer: null
        };
        this.startTimer = this.start.bind(this);
    }

    msToTime(duration) {

        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);

        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        return {
            minutes,
            seconds,
        };
    }

    componentDidMount() {
        this.startTimer()
    }

    start() {
        if (!this.state.timer) {
            this.state.startTime = Date.now();
            this.timer = window.setInterval(() => this.run(), 10);
        }
    }

    run() {
        const diff = Date.now() - this.state.startTime;

        // If you want to count up
        // this.setState(() => ({
        //  time: this.msToTime(diff)
        // }));

        // count down
        let remaining = this.state.duration - diff;
        if (remaining < 0) {
            remaining = 0;
        }
        this.setState(() => ({
            time: this.msToTime(remaining)
        }));
        if (remaining === 0) {
          this.startTimer()
        }
    }

    render() {
        return (
            <Fragment>
                 <span className='mx-1'>
                     <b>{this.state.time.seconds} :</b>
                     <b>{this.state.time.minutes} </b>
                 </span>
            </Fragment>
        )
    }
}

export default CountDownTimer