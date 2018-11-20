import React from 'react';
import "../request/RequestModel"
import { Input, Radio, Select } from 'antd';

const Option = Select.Option;
class SetCategoryModel extends React.Component{


    constructor(props) {
        super(props);
        this.state = {
            addData : [],
        }
    }
    
    
    componentDidMount() {
        console.log(this.props.data)
    }
    
    render(){
        var option = this.props.data.productSel.map((data,i) =>{
            return <Option value={data.typeId} key={i}>{data.typeValue}</Option>
        })
        return(
            <table className="formStyle">
                <thead>
                    <tr><th></th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span>产品类型</span></td>
                        <td>
                            <Select defaultValue="" style={{ width: 260 }}>
                                <Option value="">请选择</Option>
                                {option}
                            </Select>
                            
                        </td>
                    </tr>
                    <tr>
                        <td><span>话术主题</span></td>
                        <td>
                            <input type="text" style={{ width: 260 }}/>
                        </td>
                    </tr>
                    <tr>
                        <td><span>话术内容</span></td>
                        <td>
                            <input type="file" style={{ width: 260 }} />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default SetCategoryModel