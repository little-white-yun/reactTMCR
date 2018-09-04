import React from 'react'
import { Spin } from 'antd';

class Loading extends React.Component {
    render() {
        let displayStyle = this.props.show == true ?
            { display: "" } : { display: "none" };
        return (
            <div style={displayStyle}>
                <Spin size="large" />
            </div>        
        )
    }
}

export default Loading