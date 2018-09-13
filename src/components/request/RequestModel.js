import React from 'react';
import axios from 'axios';
import moment from 'moment';
import ComSelect from "../common/ComSelect"
import {Input, Radio, Select} from 'antd';
import { DatePicker } from 'antd';
import { URL } from "../../api/config"
import "./RequestModel.css"
const RadioGroup = Radio.Group;
const Option = Select.Option;

function fromatDate(timestemp) {
    if (timestemp == null) {
        return '';
    }
    var time = new Date(timestemp);
    var y = time.getFullYear(); //年
    var m = time.getMonth() + 1; //月
    var d = time.getDate(); //日
    var h = time.getHours(); //时
    var mm = time.getMinutes(); //分
    var s = time.getSeconds(); //秒
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    if (h < 10) {
        h = '0' + h;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (s < 10) {
        s = '0' + s;
    }
    return y + "-" + m + "-" + d;
}
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
        console.log(this.props.data.editAjaxData);

        // 编辑渲染列表
        stateCopy.editData = this.props.data.editAjaxData;
        var editAjaxData = this.props.data.editAjaxData;
        // stateCopy.editData.customerld = editAjaxData.customerName;
        // stateCopy.editData.docaddress = editAjaxData.docaddress;
        // stateCopy.editData.receiveld = editAjaxData.employeeBackCd;
        stateCopy.editData.endTime = fromatDate(editAjaxData.endTime.time);
        // stateCopy.editData.content = editAjaxData.content;
        // console.log(stateCopy.editData.endTime);
        // stateCopy.editData.type = editAjaxData.type;
        // stateCopy.editData.productType = editAjaxData.productType;
        // stateCopy.editData.theme = editAjaxData.theme;
        
        
        this.setState({ stateCopy})
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
            this.setState({ stateCopy })

        }
        // input改变事件
        this.changeInput = (e) => {
            stateCopy.editData[e.target.name] = e.target.value;
            this.setState({ stateCopy })
            console.log(stateCopy);

        }
        // 时间的改变事件
        this.endTimeChange = (e,dateString) =>{
            console.log(dateString);
            stateCopy.editData.endTime = dateString;
            this.setState({ stateCopy })
            
        }
        // 请求框改变事件

        this.categoryChage = (value,e) => {
            console.log(value);
            stateCopy.editData[e.ref] = value;
            this.setState({ stateCopy })
        }
    }
    
    render(){
        const dateFormat = 'YYYY-MM-DD';
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
        var endTime = this.state.editData.endTime;
        console.log('2018-9-11');
        return (
            <table className="formStyle">
                <thead>
                    <tr><th></th></tr>
                </thead>
                <tbody>
                <tr>
                    <td><span>医生</span></td>
                    <td>
                            <Input style={{ width: 260 }} name="customerld" value={this.state.editData.customerName} onChange={this.changeInput} />
                    </td>
                </tr>
                <tr>
                    <td><span>医院</span></td>
                    <td>
                            <Select defaultValue="" style={{ width: 260 }} value={this.state.editData.docaddress} onChange={this.changeSelectDoc}>
                            <Option value="">请选择</Option>
                            {option}
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td><span>代表</span></td>
                    <td>
                            <Select defaultValue="" value={this.state.docName} value={this.state.editData.employeeBackCd} onChange={this.changeDocName} style={{ width: 260 }} >
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
                            <Select defaultValue={this.state.editData.productType} value={this.state.editData.type} ref='type' onChange={this.categoryChage} style={{ width: 260 }} >
                                <Option value="" ref='productType'>请选择</Option>
                            {categoryOption}
                        </Select>
                     </td>
                </tr>
                <tr>
                    <td><span>产品类型  </span></td>
                    <td>
                            <Select defaultValue={this.state.editData.type} value={this.state.editData.type} ref='productType' onChange={this.categoryChage} style={{ width: 260 }} >
                                <Option value="" ref='type'>请选择</Option>
                            {productOption}
                        </Select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>截止日期  </span>
                    </td>
                    <td>
                        {console.log(endTime)}
                            <DatePicker 
                                defaultValue={moment(this.state.editData.endTime, dateFormat)} format={dateFormat}  onChange={this.endTimeChange} style={{ width: 290 }} />
                            {/* defaultValue={this.state.editData.endTime} onChange={this.endTimeChange} style={{ width: 290 }} /> */}
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>请求内容  </span>
                    </td>
                    <td>
                        <textarea value={this.state.editData.content} name="content" id="" cols="40" rows="5" onChange={this.changeInput}></textarea>
                    </td>
                </tr>
                </tbody>
            </table>
        )
    }
}

export default RequestModel