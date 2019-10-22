import React, { Component } from "react";
import connect from "../../assets/redux/connect";
import { Link, Redirect } from "react-router-dom";
import TableListComponent from "../../components/user-list";

class DashboardPage extends Component {
    componentDidMount() {
        if (typeof window !== "undefined") {
            let { offset, limit, users } = this.props;
            this.props.getUsers({
                offset,
                limit: users.limit || 20,
                token: users.token
            });
            this.props.getUsersInfo({ token: users.token });
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

    async handleMakeAction(action, users) {
        let { token } = this.props.users;
        switch (action) {
            case "remove":
                try {
                    await this.props.removeUsers({ list: users, token });
                    this.props.getUsersInfo({ token });
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

        if (!this.props.users.user) {
            return <Redirect to="/admin"></Redirect>;
        }
        let handleChangePage = this.handleChangePage.bind(this);
        let handleMakeAction = this.handleMakeAction.bind(this);
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
                            <div className="col s12">
                                <TableListComponent
                                    list={list}
                                    offset={offset}
                                    limit={limit}
                                    all={all}
                                    changePage={handleChangePage}
                                    makeAction={handleMakeAction}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {actionStatus === 1 ? (
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
