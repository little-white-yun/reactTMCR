import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { URL } from "./api/config"
import './index.css';
import App from "./App";

function loading (e){
    console.log(this.state.ntaccount);
}



class Index extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            ntaccount: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        console.log(e);
        this.setState({ ntaccount: e.target.value });
    }
    handleClick(ntaccount){
        console.log(ntaccount);
        axios.get(URL.login, {   // 获取下拉框
            params: {
                ntaccount: ntaccount,
            }
        })
        .then((data) => {
            data = data.data;
            sessionStorage.setItem("employeeCd", data.employeeCd);
            sessionStorage.setItem("employeeName", decodeURI(data.employeeName));
            sessionStorage.setItem("productGroup", data.productGroup);
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("userType", data.userType);
            ReactDOM.render(<App />, document.getElementById('root'));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    render(){
        const employeeCd = sessionStorage.getItem("employeeCd");
        if (employeeCd == "" || !employeeCd){
            return (
                <div>
                    <input type="text" value={this.state.ntaccount} onChange={this.handleChange} />
                    <button onClick={(e) => this.handleClick(this.state.ntaccount)}>提交</button>
                </div>
            )
        } else {
            return (
                <App />
            )
        }
        
    }

}

ReactDOM.render(
    <Index />,
    document.getElementById('root')
);

// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();