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
            title:"新 建",
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
                status:0,
                myRequest:1,
                pageIndex:1,
                pageSize:1000,
            },
            deleteInfo:{
                communicationId:[],
                delete:0,
                token:sessionStorage.getItem("token")
            },
            editData:[],
            dataInfo:[],
            visible: false    
        }
    }
    // 模态框打开
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

   
    // 模态框关闭
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

    // 列表复选框的改变事件
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
        var del = this.state.deleteInfo;
        del.communicationId = selectedRowKeys;
        console.log(this.state.deleteInfo);
    }
    
    
    componentDidMount(){  
        console.log(this.state);
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
        .catch(function (error) {
            console.log(error);
        })
       
        this.getTable()

        var requestData = this.state;
        this.onChange = (date, dateString) => {
            requestData.requestData.beginTime = dateString;
        }
        this.handleChange = (value) => {
            requestData.requestData.ccPoint = value;
        }
        this.stateChange = (value) => {
            requestData.requestData.status = value;
        }
        this.endTimeChange = (date, dateString) => {
            requestData.requestData.endTime = dateString;
        }
        this.vauleChange = (e) => {
            requestData.requestData[e.target.name] = e.target.value;
        }

        // 查询按钮
        this.queryRequest = (e) => {
            console.log(this.state.requestData);
            this.getTable();
        }

        // 删除按钮
        this.deleteClick = (e) => {
            requestData.deleteInfo.communicationId = this.state.deleteInfo.communicationId.join(",");
            axios.get(URL.updateCmcs, {
                params: this.state.deleteInfo
            })
                .then((data) => {
                    this.setState({
                        loading: false
                    })
                    if (data.data.errorCode == 0) {
                       alert("操作成功");
                        this.getTable();

                    } else {
                        dataList.push("");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

        }
        // 模态框提交按钮
        this.modalSubmitClick = (e) => {
            var editInfo = this.state.editData;
            editInfo.status = 1;
            this.submitModal();
            // this.handleCancel();
            
        }
        // 模态框保存按钮
        this.modalSaveClick = (e) => {
            var editInfo = this.state.editData;
            editInfo.status = 0;
            // this.handleCancel();
            this.submitModal();
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
                    info.key = item.communicationId;
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
    // 新建/编辑提交事件
    submitModal = (e) =>{
        console.log(this.state.editData);
        axios.post(URL.insertCmcs, {
            params: this.state.editData
        })
        .then((data) => {
            this.setState({
                loading: false
            })
            if (data.data.errorCode == 0) {
                alert("操作成功")
                this.handleCancel();
                this.getTable();

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
    
    transferMsg(msg) {
        console.log(222222222);
        console.log(msg);
        console.log(this.state);
        this.setState({
            editData:msg
        });
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
                        title={this.state.title}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="submit" type="primary" onClick={this.modalSubmitClick}>
                                提交
                            </Button>,
                            <Button key="submit1" onClick={this.modalSaveClick}>
                                保存
                            </Button>,
                        ]}
                    >
                            <RequestModel data={this.state} transferMsg={msg => this.transferMsg(msg)} />
                                                
                    </Modal>
                    <Button className="btnStyle">编 辑</Button>
                    <Button type="danger" onClick={this.deleteClick} className="btnStyle">删 除</Button>
                </Col>
                </Row>
                <Table rowSelection={rowSelection} 
                columns={columns} 
                pagination={{ pageSize: 10 }} 
                dataSource={this.state.dataInfo} 
                className='tableStyle' 
                scroll={{ y: 240 }}/>
                <Loading title='正在加载...' show={this.state.loading} />
            </div>
        )
    }
}

export default Request