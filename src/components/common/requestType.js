import React from 'react';
import { Col,Select} from 'antd';
class RequestType extends React.Component {
    
    componentDidMount() {
        var listData = this.props.data.requestData;
        this.changeTyle = (value,e) => {
            listData[e.ref] = value;
        }
    }
    render(){
        console.log(this.props)
        const Option = Select.Option;
        const type = this.props.state;
        console.log(type);
        const option = this.props.type.map((data) =>
            <Option value={data.typeId} ref={type} key={data.typeId}>{data.typeValue}</Option>
        )
        
        
        return(
                <Select defaultValue="" ref='type' name="type" onChange={this.changeTyle} style={{ width: 242 }}>
                <option value="">请选择</option>
                    {option}
                </Select>
        )
    }
}

export default RequestType