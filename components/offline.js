import { Component } from "react";



class Offline extends Component {

    state = {
        offline: false
    }

    componentDidMount() {
        window.addEventListener('offline', () => {
            this.setState({ offline: true })
        });
        window.addEventListener('online', () => {
            this.setState({ offline: false })
        })
    }

    render() {
        return this.state.offline ? this.props.children : null

    }

}



export default Offline

const OffLineWarn = () => <Offline>
    <h5 className="py-3" style={{ textAlign: "center", background: '#d77' }}>
        اینترنت قطعه 🤕
    </h5>
</Offline>

export { OffLineWarn }


