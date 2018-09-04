import React from 'react';
import { Col, Select } from 'antd';


class ComSelect extends React.Component {

    componentDidMount() {
        if (this.props.data){
            var listData = this.props.data.requestData;
            this.changeTyle = (value, e) => {
                console.log(value);
                listData[e.ref] = value;
                console.log(listData);
            }
        }
        
    }
    render() {
        const Option = Select.Option;
        const type = this.props.state;
        const option = this.props.type.map((data) =>
            <Option value={data.typeId} ref={type} key={data.typeId}>{data.typeValue}</Option>
        )


        return (
            <Select defaultValue="" ref='type' name="type" onChange={this.changeTyle} style={{ width: 242 }}>
                {option}
            </Select>
        )
    }
}

export default ComSelect