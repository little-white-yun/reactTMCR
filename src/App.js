import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Breadcrumb, Icon, Spin, Alert } from 'antd';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route, Switch, Redirect, NavLink } from "react-router-dom"
import Request from "./components/request/Request"
import CustomerStatus from "./components/customerStatus/CustomerStatus"
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends Component {
  state = {
    collapsed: false,
    mode: 'inline',
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
      <div>
      <Router>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              {/* <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item> */}
            </Menu>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
              >
                <Menu.Item key="1">
                  <NavLink to='/request' className="nav-link">请求</NavLink>
                </Menu.Item>
                {/* CustomerStatus */}
                <Menu.Item key="2">
                  <NavLink to='./CustomerStatus'>客户状态</NavLink>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Content style={{ background: '#fff', padding: 24, height: 590,margin: 16, minHeight: 280 }}>
                <Switch>
                  <Route path='/request' component={Request} />
                  <Route path='/CustomerStatus' component={CustomerStatus} />
                  <Redirect from='/' to='/request' />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
      </div>
    )
  }
}

export default App;
