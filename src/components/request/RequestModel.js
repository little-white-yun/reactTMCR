import React from 'react';
import axios from 'axios';
import ComSelect from "../common/ComSelect"
import {Input, Radio, Select} from 'antd';
import { DatePicker } from 'antd';
import { URL } from "../../api/config"
import "./RequestModel.css"
const RadioGroup = Radio.Group;
const Option = Select.Option;
class RequestModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hospital:[],
            dwTdUsers:[],
            editData:{
                customerName: '',
                customerld:'',
                docaddress:'',
                receiveld:'',
                theme:'请跟进',
                type:1,
                ccPoint:'',
                productType:'',
                scId:'',
                callTheme:'',
                endTime:'',
                content:'',
                callId:'',
                status:'',
                parentId:''
            }
        }
    }
    
    componentDidMount() {
        // 获取下拉框
        axios.get(URL.getHospital, {
            params: {
                token: sessionStorage.getItem("token")
            }
        })
        .then((data) => {
            this.setState({
                hospital: data.data.hospitals,
            })
        })
        .catch(function (error) {
            console.log(error);
        })
       
        this.changeSelectDoc = (value) => {
            console.log(value);
            // 获取代表
            axios.get(URL.getHospital, {
                params: {
                    token: sessionStorage.getItem("token"),
                    hospitalName:value
                }
            })
            .then((data) => {
                this.setState({
                    dwTdUsers: data.data.dwTdUsers
                })
                console.log(data.data.dwTdUsers);
            })
            .catch(function (error) {
                console.log(error);
            })
        }
    }
    changeInput = (e) => {
        var dataInfo = this.setState;
        console.log(dataInfo);
        dataInfo.editData[e.target.name]=e.target.value;

    }
    
    render(){
        const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
        var editInfo = this.setState;
        console.log(this.state.hospital);
        const option = this.state.hospital.map((data,i) => 
            <Option value={data} key={i}>{data}</Option>
        )
        const employee = this.state.dwTdUsers.map((data, i) =>
            <Option value={data.employeeCd} key={i}>{data.employeeName}</Option>
        )
        console.log(option);
        return (
            <table className="formStyle">
                <thead>
                    <tr><th></th></tr>
                </thead>
                <tbody>
                <tr>
                    <td><span>医生</span></td>
                    <td>
                        <Input style={{ width: 260 }} name="customerName" onChange={this.changeInput} />
                    </td>
                </tr>
                <tr>
                    <td><span>医院</span></td>
                    <td>
                        <Select defaultValue="" style={{ width: 260 }} onChange={this.changeSelectDoc}>
                            <Option value="">请选择</Option>
                            {option}
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td><span>代表</span></td>
                    <td>
                        <Select defaultValue="" style={{ width: 260 }} >
                            <Option value="">请选择</Option>
                                {employee}
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <RadioGroup onChange={this.onChange} value={this.state.editData.theme}>
                            <Radio value='请知晓'>请知晓</Radio>
                            <Radio value='请跟进'>请跟进</Radio>
                        </RadioGroup>
                    </td>
                </tr>
                <tr>
                    <td><span>请求类型  </span></td>
                     <td>
                        <ComSelect type={[
                            { typeId: '', typeValue: "请选择" },
                        ]} style={{ width: 260 }} state='hospital' />
                     </td>
                </tr>
                <tr>
                    <td><span>产品类型  </span></td>
                    <td>
                        <ComSelect type={[
                            { typeId: '', typeValue: "请选择" },
                        ]} style={{ width: 260 }} state='hospital' />
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>截止日期  </span>
                    </td>
                    <td>
                        <DatePicker onChange={this.onChange} style={{ width: 290 }} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>请求内容  </span>
                    </td>
                    <td>
                        <textarea name="content" id="" cols="40" rows="5" onChange={this.ChangeInput}></textarea>
                    </td>
                </tr>
                </tbody>
            </table>
        )
    }
}

export default RequestModel