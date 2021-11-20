import React from "react";
import ClipLoader from "react-spinners/ClipLoader";


class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: this.props.size || '20',
            color: this.props.color || '#FFFFFF',
            loading: this.props.loading || false,
        };
    }

    render() {
        const {loading, size, color} = this.state
        return (
            <div className="flex items-center justify-center text-center">
                <ClipLoader
                    size={size}
                    color={color}
                    loading={loading}
                />
            </div>
        );
    }
}

export default Loading