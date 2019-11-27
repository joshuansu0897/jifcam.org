import React, { Component } from "react";
import connect from "../../assets/redux/connect";
import { Link, Redirect } from "react-router-dom";
import TableListComponent from "../../components/user-list";
import { getToken, login } from "../../utils/authenticator";

class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionStatus: 0
        };
    }
    componentDidMount() {
        if (typeof window !== "undefined") {
            let { offset, limit, token } = this.props.users;
            this.props.getUsers({
                offset: offset || 0,
                limit: limit || 20,
                token: token
            });
            if (!getToken() && token) {
                login(token);
            }
            this.props.getUsersInfo();
            /*this.props.getUserVideos({
                offsee: 1,
                limit: 1,
                token: users.token
            });*/
        }
    }

    handleChangePage(offset, limit) {
        let { token } = this.props.users;
        this.props.getUsers({ offset, limit, token });
    }

    handleSuspendUser(user) {
        this.props.suspendUser(user)
    }

    async handleMakeAction(action, users) {
        let { token } = this.props.users;
        switch (action) {
            case "remove":
                try {
                    this.setState({ actionStatus: 1 });
                    await this.props.removeUsers({ list: users, token });
                    await this.props.getUsers({
                        offset: this.props.users.offset || 0,
                        limit: this.props.users.limit || 20,
                        token: this.props.users.token
                    });
                    this.setState({ actionStatus: 0 });
                    alert("Users were removed");
                } catch (err) {
                    console.error(err);
                }
                break;
        }
    }

    render() {
        let {
            users: { list, offset, limit, all, verified },
            actionStatus
        } = this.props;
        if (!this.props.users.token) {
            return <Redirect to="/admin"></Redirect>;
        }
        let handleChangePage = this.handleChangePage.bind(this);
        let handleMakeAction = this.handleMakeAction.bind(this);
        let handleSuspendUser = this.handleSuspendUser.bind(this);
        // return <div />;
        return (
            <div>
                <div className="PageDashboard">
                    <div className="container">
                        <div className="row">
                            <div className="col s12">
                                <h3> Dashboard </h3>
                            </div>
                            <div className="col s12">
                                {" "}
                                <h5>
                                    {" "}
                                    <span>
                                        {" "}
                                        <b>{all}</b> Users{" "}
                                    </span>{" "}
                                    /{" "}
                                    <span>
                                        {" "}
                                        <b>{verified}</b> Verified{" "}
                                    </span>{" "}
                                </h5>{" "}
                            </div>
                            <div>
                                <TableListComponent
                                    list={list}
                                    offset={offset}
                                    limit={limit}
                                    all={all}
                                    changePage={handleChangePage}
                                    makeAction={handleMakeAction}
                                    suspendUser={handleSuspendUser}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.actionStatus === 1 ? (
                    <div className="overlay-loading">
                        <div className="preloader-wrapper small active">
                            <div className="spinner-layer spinner-green-only">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div>
                                <div className="gap-patch">
                                    <div className="circle"></div>
                                </div>
                                <div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                        <div></div>
                    )}
            </div>
        );
    }
}

export default connect(DashboardPage);
