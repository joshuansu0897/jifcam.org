import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import TableListComponent from '../../components/user-list';
import { USER_ACTIONS } from '../../constants';
import { removeUsers } from '../../actions/users';

class DashboardPage extends Component{
    
    componentDidMount(){
        if(typeof window !== 'undefined'){
            let { offset, limit, token } = this.props;
            this.props.getUsers(offset, limit, token);
            this.props.getUsersInfo(token);
            this.props.getUserVideos(1, 1, token);
        }
    }

    handleChangePage(offset, limit){
        let { token } = this.props;
        this.props.getUsers(offset, limit, token);
    }

    handleMakeAction(action, users){
        let { token } = this.props;
        switch(action){
            case "remove":
                this.props.removeUsers(users, token)
            break;
        }
    }

    render(){
        let { list, offset, limit, all, user, verified, actionStatus } = this.props;
        
        if(!user) {
            return <Redirect to="/admin"></Redirect>
        }
        let handleChangePage = this.handleChangePage.bind(this);
        let handleMakeAction = this.handleMakeAction.bind(this);

        return (<div>
            <div className="PageDashboard">
                <div className="container">
                    <div className="row">
                        <div className="col s12">
                            <h3> Dashboard </h3>
                        </div>
                        <div  className="col s12"> <h5> <span> <b>{all}</b> Users  </span> / <span> <b>{verified}</b> Verified </span> </h5> </div>
                        <div className="col s12">
                            <TableListComponent list={list} offset={offset} limit={limit} all={all} changePage={handleChangePage} makeAction={handleMakeAction} />
                        </div>
                    </div>
                </div>
               
            </div>
            {actionStatus===1?(<div className="overlay-loading"> 
                <div className="preloader-wrapper small active">
                        <div className="spinner-layer spinner-green-only">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div><div className="gap-patch">
                            <div className="circle"></div>
                        </div><div className="circle-clipper right">
                            <div className="circle"></div>
                        </div>
                        </div>
                </div>
            </div>):<div></div>}
        </div>)
    }
}

export default connect(state=>({
    user: state.users.logged,
    list:  state.users.list,
    token: state.users.token,
    status:  state.users.requestStatuses.list,
    actionStatus:  state.users.requestStatuses.actions,
    offset: state.users.offset,
    limit: state.users.limit,
    verified: state.users.verifiedInfo.verified,
    notVerified: state.users.verifiedInfo.notVerified,
    all: state.users.all
}), dispatch=>({
    getUsers: (offset, limit, token)=>{
        dispatch({type: USER_ACTIONS.REQUEST_LIST, data: { offset, limit, token }})
    },
    getUserVideos: (offset, limit, token)=>{
        console.log('mount1 connect')
        dispatch({type: USER_ACTIONS.GET_VIDEO_LIST, data: { offset, limit, token }})
    },
    getUsersInfo: (token)=>{
        dispatch({type: USER_ACTIONS.REQUEST_INFO_VERIFIED, data: { token: token }})
    },
    removeUsers: (users, token)=>{
        dispatch({type: USER_ACTIONS.REQUEST_REMOVE, list: users, token: token});
    }


}))(DashboardPage);