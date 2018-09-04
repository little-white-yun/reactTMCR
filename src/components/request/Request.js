import React from 'react';
import axios from 'axios';
import { Row, Col, Input, Select, Button, Table, Modal} from 'antd';
import { DatePicker } from 'antd';
import './Request.css';
import Loading from "../../common/loading/Loading"
import {URL } from "../../api/config"
import ComSelect from "../common/ComSelect"
import RequestModel from "./RequestModel"
const columns = [{
    title: '请求类型',
    dataIndex: 'typeValue',
    width: 250,
}, {
    title: '医生',
    dataIndex: 'customerName',
    width: 150,
}, {
    title: '代表',
    dataIndex: 'employeeName',
    width: 150,
}, {
    title: 'CC机会点是否转换成功',
    dataIndex: 'ccPoint',
    width: 200,
}, {
    title: '日期',
    dataIndex: 'createTime',
    width: 150,
}, {
    title: '状态',
    dataIndex: 'status',
    width: 150,
}];
const dataList = [];


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
    // return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
    return y + "-" + m + "-" + d;
}







class Request extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 'large',
            selectedRowKeys: [], // Check here to configure the default column
            loading: true,
            type: [],
            requestData :{        // 获取列表数据
                beginTime:'',
                endTime:'',
                customerName:'',
                employeeName:'',
                ccPoint:'',
                status:'',
                myRequest:1,
                pageIndex:1,
                pageSize:1000,
            },
            dataInfo:[],
            visible: false    
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        
        // this.setState({
        //     visible: false,
        // });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    
    
    componentDidMount(){  
        // 获取下拉框
        axios.get(URL.getCrType, {   
            params: {
                typeCate: "crType",
                with: "all",
                token:sessionStorage.getItem("token")
            }
        })
        .then( (data) => {
            var typeData = [{ typeCate: "crType", typeId: "", typeValue: "请选择", userType: "MC" }];
            data.data.data.map(function(item,i){
                typeData.push(item);
            })

            this.setState({
                type: typeData
            })
            console.log(typeData);
        })
        // { typeCate: "crType", typeId: "2", typeValue: "请面对面拜访", userType: "MC" }
        .catch(function (error) {
            console.log(error);
        })
       
        this.getTable()

        var requestData = this.state.requestData;
        this.onChange = (date, dateString) => {
            
            requestData.beginTime = dateString;

        }
        this.handleChange = (value) => {
            
            requestData.ccPoint = value;

        }
        this.stateChange = (value) => {
            
            requestData.status = value;

        }
        this.endTimeChange = (date, dateString) => {
            
            requestData.endTime = dateString;
        }

        this.vauleChange = (e) => {
            
            requestData[e.target.name] = e.target.value;
        }
    }

     // 获取列表
    getTable = (e) => {
        this.setState({
            loading:true
        })
        axios.get(URL.cmcsList, {   
            params: this.state.requestData
        })
        .then((data) => {
            this.setState({
                loading: false
            })
            if (data.data.errorCode == 0){
                data = data.data.data;
                var dataList = [];
                data.map(function (item, i) {
                    var info = {};
                    info.key = i;
                    info.typeValue = item.typeValue;
                    info.customerName = item.customerName;
                    info.employeeName = item.employeeName;
                    info.token = sessionStorage.getItem("token");
                    if (item.ccPoint != 0) {
                        info.ccPoint = "非机会点请求";
                    } else if (item.ccPointChange != "") {
                        info.ccPoint = "成功";
                    } else {
                        info.ccPoint = "未成功";
                    }
                    info.createTime = fromatDate(item.createTime.time);
                    if (item.status == 0) {
                        item.status = "待提交";
                    } else if (item.status == 1) {
                        item.status = "待反馈";
                    } else if (item.status == 2) {
                        item.status = "已反馈";
                    } else {
                        item.status = "已结束";
                    }
                    info.status = item.status;
                    dataList.push(info);
                })
               
            } else {
                dataList.push("");
            }
            this.setState({
                dataInfo: dataList
            })
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    // 查询按钮
    queryRequest = (e) => {
        console.log(this.state.requestData);
        this.getTable();
    }
    

  render(){
      const size = this.state.size;
      const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
      const Option = Select.Option;
      const { selectedRowKeys } = this.state;
      const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
      };
      const hasSelected = selectedRowKeys.length > 0;
        return (
            <div className="gutter-example requestStyle">
            <Row>
                <div>
                    <Col className="gutter-row" span={16}>
                        <span>日期</span>
                            <DatePicker onChange={this.onChange} style={{ width: 290 }}/>
                        <span>TO</span>
                            <DatePicker onChange={this.endTimeChange} style={{ width: 290 }}/>
                    </Col>
                    <Col className="gutter-row" span={8} >
                            <span className="spanStyle">医 生</span>
                            <Input placeholder="请输入医生姓名" name="customerName" onChange={this.vauleChange} className="docInput" style={{width:260}}/>
                    </Col>
                    <Col className="gutter-row" span={6}>
                            <span className="spanStyle">代表</span>
                            <Input placeholder="请输入医生代表" name='employeeName' style={{ width: 219 }}  onChange={this.vauleChange}/>
                    </Col>
                        <Col className="gutter-row" span={8}>
                            <span className="spanStyle" style={{ width: 79 }}>请求类型</span>
                            <ComSelect type={this.state.type} data={this.state} state='type' />
                         </Col>

                    <Col className="gutter-row" span={9}>
                        <span className="spanStyle" name='ccPoint' style={{ width: 79 }}>CC机会点</span>
                            <ComSelect type={[
                                { typeId: '', typeValue: "请选择" },
                                { typeId: 0, typeValue:"是"},
                                { typeId: 1, typeValue: "否" }
                            ]} data={this.state} state='ccPoint' />

                    </Col>
                    <Col className="gutter-row" span={8}>
                            <span className="spanStyle" name='state'>状态</span>
                            <ComSelect type={[
                                { typeId: '', typeValue: "请选择" },
                                { typeId: 0, typeValue: "待提交" },
                                { typeId: 1, typeValue: "待反馈" },
                                { typeId: 2, typeValue: "已反馈" },
                                { typeId: 3, typeValue: "已结束" },
                            ]} data={this.state} state='status' />
                    </Col>
                    <Col className="gutter-row" span={2} offset={13}>
                        <Button type="primary" size={size} onClick={this.queryRequest}>查 询</Button>
                    </Col>
                </div>
                <Col className="gutter-row lineStyle " span={24} >
                </Col>
                <Col span={8} offset={17}>
                        <Button type="primary" className="btnStyle" onClick={this.showModal}>新 建</Button>
                        <Modal
                            title="Basic Modal"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                // <Button key="back" onClick={this.handleCancel}>Return</Button>,
                                <Button key="submit" type="primary" onClick={this.handleOk}>
                                    提交
                                </Button>,
                                <Button key="submit1" onClick={this.handleOk}>
                                   保存
                                </Button>,
                            ]}
                        >
                            <RequestModel/>
                                                    
                        </Modal>
                        <Button className="btnStyle">编 辑</Button>
                        <Button type="danger" className="btnStyle">删 除</Button>
                </Col>
                </Row>
                <Table rowSelection={rowSelection} columns={columns} pagination={{ pageSize: 10 }} dataSource={this.state.dataInfo} className='tableStyle' scroll={{ y: 240 }}/>
                <Loading title='正在加载...' show={this.state.loading} />
            </div>
        )
    }
}

export default Request