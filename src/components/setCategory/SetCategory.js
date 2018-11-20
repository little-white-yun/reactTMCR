import React from 'react'
import { Row, Col, Select, Button, Table, Modal   } from 'antd';
import axios from 'axios';
import Loading from "../../common/loading/Loading"
import { URL } from "../../api/config"
import "./setCategory.css"
import "../request/Request.css"
import SetCategoryModel from "./SetCategoryModel"
const Option = Select.Option;
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }}
const columns = [{
    title: '产品类型',
    dataIndex: 'prodyctTypeE.typeValue',
    width:150
}, {
    title: '话术主题',
    dataIndex: 'scTheme',
    width:300
}, {
    title: '更新日期',
    dataIndex: 'updateTime.time',
    width:150
}];

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


class SetCategory extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            productSel:[],
            themeSel:{},
            queryList:{
                pageIndex:1,
                pageSize:100,
                productType:"",
                theme:"",
                token:sessionStorage.getItem("token")
            },
            listData:[],
            visible: false
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    hideModal = () => {
        this.setState({
            visible: false,
        });
    }

    componentDidMount(){
       
        // 获取产品
        axios.get(URL.getCrType, {
            params: {
                typeCate: "productType",
                token: sessionStorage.getItem("token")
            }
        })
        .then((data) => {
            data = data.data.data;
            console.log(data);
            this.setState({
                productSel:data
            })
        })
        .catch(function (error) {
            
        })

        // 获取列表
        this.getListFun();
       
        


        // 产品 - 请求主题级联
        this.selChange = (value)=>{
            var queryList = this.state.queryList;
            console.log(value);
            queryList.productType = value;
            queryList.theme = "";
            this.setState({
                queryList
            })
            this.state.loading = true;
            axios.get(URL.getScList,{
                params:{
                    productType:value,
                    token: sessionStorage.getItem("token")
                }
            })
            .then((data) => {
                this.state.loading = false;
                this.setState({
                    themeSel: data.data.speechCrafts
                })
                console.log(this.state.themeSel);

                const themeOption = this.state.themeSel.map((data,i) => {
                    console.log(data)
                })

            })
            .catch(function(error){
                console.log(error);
            })
        }


        // 产品切换
        this.themeChange =(value) =>{
            console.log(value);
            var queryList = this.state.queryList;
            queryList.theme = value;
            this.setState({
                queryList
            })
        }


        // 查询列表
        this.queryEventList = (data) => {
            console.log(this.state.queryList);
           
            this.getListFun();
        }

    }

    getListFun = (e) => {
        this.setState({
            loading: true
        })
        // 获取列表
        axios.get(URL.getScList, {
            params: this.state.queryList
        })
            .then((data) => {
                this.setState({
                    loading: false
                })
                data = data.data.speechCrafts;
                data.map((value, i) => {
                    console.log(value);
                    value.updateTime.time = fromatDate(value.updateTime.time);
                })
                this.setState({
                    listData: data
                })
                console.log(this.state.listData);


            })
            .catch(function (error) {
            })
    }
    
    render(){
        // 产品选项
        const option = this.state.productSel.map((data, i) => {
            console.log(data.typeValue);
            return <Option value={data.typeId} key={data.typeId}>{data.typeValue}</Option>
        })
        
        return (
            <div>
                <div className="gutter-example">
                    <Row gutter={20}>
                        <Col className="gutter-row" span={2}>
                            <span>产品类型</span>
                        </Col>
                        <Col span={6}>
                            <Select defaultValue="" style={{ width: 220 }} onChange={this.selChange}>
                                <Option value="">请选择</Option>
                                {option}
                            </Select>
                        </Col>
                        <Col className="gutter-row" span={2}>
                            <span>话术主题</span>
                        </Col>
                        <Col span={6}>
                            <Select defaultValue={this.state.queryList.theme} value={this.state.queryList.theme} style={{ width: 220 }} onChange={this.themeChange}>
                                <Option value="">请选择</Option>
                                {this.state.themeSel.length ? this.state.themeSel.map((data,i) => {
                                    return <Option value={data.scTheme} key={i}>{data.scTheme}</Option>
                                }):""}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" onClick={this.queryEventList}>查询</Button>
                        </Col>
                        <Col className="gutter-row lineStyle " span={24} >
                        </Col>
                        <Col span={8} offset={17}>
                            <Button type="primary" className="btnStyle" onClick={this.showModal}>新 建</Button>
                            <Modal
                                title="Modal"
                                visible={this.state.visible}
                                onOk={this.hideModal}
                                onCancel={this.hideModal}
                                okText="确认"
                                cancelText="取消"
                            >
                               <SetCategoryModel data={this.state} />
                            </Modal>
                            <Button className="btnStyle">编 辑</Button>
                            <Button type="danger" className="btnStyle">删 除</Button>
                        </Col>
                    </Row>
                    <Table 
                    rowSelection={rowSelection} 
                    columns={columns} 
                    pagination={{ pageSize: 10 }} 
                    dataSource={this.state.listData} 
                    scroll={{ y: 240 }}
                    />,
                    <Loading title='正在加载...' show={this.state.loading} />
                </div>
            </div>
        )
    }
}

export default SetCategory