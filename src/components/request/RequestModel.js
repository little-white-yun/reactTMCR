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
            docName:"",
            type:[],
            productType:[],
            editData:{
                customerld:'',
                docaddress:'',
                receiveld:'',
                theme:'请跟进',
                type:'',
                ccPoint:'',
                productType:'',
                scId:'',
                callTheme:'',
                endTime:'',
                content:'',
                callId:'',
                status:'',
                parentId:0,
                token:sessionStorage.getItem("token")
            }
        }
    }
    
    componentDidMount() {
        setTimeout(() => {
        this.props.transferMsg(this.state)
            // this.props.transferMsg('end')
        }, 1000);
        var stateCopy = this.state;


        // 获取医院下拉框
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

        // 获取获取产品类型下拉框
        axios.get(URL.getCrType, {
            params: {
                typeCate: "productType",
                with: "all",
                token: sessionStorage.getItem("token")
            }
        })
        .then((data) => {
            this.setState({
                productType: data.data.data
            })
        })
        .catch(function (error) {
            console.log(error);
        })
        // 获取请求类型下拉框
        axios.get(URL.getCrType, {
            params: {
                typeCate: "crType",
                with: "all",
                token: sessionStorage.getItem("token")
            }
        })
        .then((data) => {

            this.setState({
                type: data.data.data
            })
        })
        .catch(function (error) {
            console.log(error);
        })
        
        // 医院改变事件
        this.changeSelectDoc = (value) => {
         
            stateCopy.editData.docaddress = value;
            // 获取代表
            axios.get(URL.getHospital, {
                params: {
                    token: sessionStorage.getItem("token"),
                    hospitalName:value
                }
            })
            .then((data) => {
                this.setState({
                    dwTdUsers: data.data.dwTdUsers,
                    docName:""
                })
                console.log(data.data.dwTdUsers);
            })
            .catch(function (error) {
                console.log(error);
            })
        }
        // 代表改变事件
        this.changeDocName = (value) => {
            this.setState({
                docName:value
            })
            stateCopy.editData.receiveld = value;

        }
        // input改变事件
        this.changeInput = (e) => {
            stateCopy.editData[e.target.name] = e.target.value;
            console.log(stateCopy);
        }
        // 时间的改变事件
        this.endTimeChange = (e,dateString) =>{
            console.log(dateString);
            stateCopy.editData.endTime = dateString;
        }
        // 请求框改变事件
        this.categoryChage = (value,e) => {
            console.log(e.ref);
            console.log(e);
            stateCopy.editData[e.ref] = value;
            console.log(stateCopy.editData);
        }
    }
    
    
    render(){
        this.props.data.editData = this.state.editData;
        const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
        var editInfo = this.state;
        const option = this.state.hospital.map((data,i) => {
            if (i < 100) {
                return <Option value={data} key={i}>{data}</Option>
            }
        })
        const employee = this.state.dwTdUsers.map((data, i) =>
            <Option value={data.employeeCd} key={i}>{data.employeeName}</Option>
        )
        const categoryOption = this.state.type.map((data) =>
            <Option value={data.typeId} ref='type' key={data.typeId}>{data.typeValue}</Option>
        )
        const productOption = this.state.productType.map((data) =>
            <Option value={data.typeId} ref='productType' key={data.typeId}>{data.typeValue}</Option>
        )
        return (
            <table className="formStyle">
                <thead>
                    <tr><th></th></tr>
                </thead>
                <tbody>
                <tr>
                    <td><span>医生</span></td>
                    <td>
                        <Input style={{ width: 260 }} name="customerld" onChange={this.changeInput} />
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
                        <Select defaultValue="" value={this.state.docName} onChange={this.changeDocName} style={{ width: 260 }} >
                            <Option value="">请选择</Option>
                                {employee}
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <RadioGroup defaultValue={this.state.editData.theme} onChange={this.changeInput} name="theme" >
                            <Radio value={'请知晓'}>请知晓</Radio>
                            <Radio value={'请跟进'}>请跟进</Radio>
                        </RadioGroup>
                    </td>
                </tr>
                <tr>
                    <td><span>请求类型  </span></td>
                     <td>
                            <Select defaultValue="" ref='type' onChange={this.categoryChage} style={{ width: 260 }} >
                                <Option value="" ref='type'>请选择</Option>
                            {categoryOption}
                        </Select>
                     </td>
                </tr>
                <tr>
                    <td><span>产品类型  </span></td>
                    <td>
                            <Select defaultValue="" ref='productType' onChange={this.categoryChage} style={{ width: 260 }} >
                                <Option value="" ref='productType'>请选择</Option>
                            {productOption}
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>截止日期  </span>
                    </td>
                    <td>
                        <DatePicker onChange={this.endTimeChange} style={{ width: 290 }} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>请求内容  </span>
                    </td>
                    <td>
                        <textarea name="content" id="" cols="40" rows="5" onChange={this.changeInput}></textarea>
                    </td>
                </tr>
                </tbody>
            </table>
        )
    }
}

export default RequestModel