import React, { Component } from "react";
import connect from "../../assets/redux/connect";
import { USER_ACTIONS } from "../../constants";

const Limit = 6;
class ChooseUserModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: {}
        };
    }

    componentDidMount() {
        if (typeof window !== "undefined") {
            let { loaded, all, token } = this.props;

            var elems = document.querySelectorAll("#modalChooseUser");
            var instances = M.Modal.init(elems, {
                onOpenStart: () => {
                    if (loaded === 0) {
                        this.props.getUsers({ offset: 0, Limit, token });
                        this.setState({
                            checked: {}
                        });
                    }
                }
            });
        }
    }

    loadMore() {
        let { offset, loaded, isLoading, all, token, list } = this.props.users;

        if (!isLoading && loaded < all) {
            this.props.getUsers({ offset: list.length, Limit, token });
        }
    }

    handleScroll(event) {
        let target = event.currentTarget;

        //console.log(target, target.offsetHeight, target.scrollTop, target.scrollHeight);
        let { offset, loaded, isLoading, all, token } = this.props.users;
        if (
            Math.abs(target.offsetHeight + target.scrollTop) >
            target.scrollHeight
        )
            this.loadMore();
    }

    addLikeChoose(user) {
        //console.log(user);
        let { checked } = this.state;
        if (checked[user._id]) {
            delete checked[user._id];
        } else {
            checked[user._id] = user;
        }
        //console.log(checked);
        this.setState({
            checked: checked
        });
    }

    sendChoosedUsers() {
        this.props.onChoose(this.state.checked);
    }

    render() {
        let handleScroll = this.handleScroll.bind(this);
        let { list } = this.props.users;
        let sendChoosedUsers = this.sendChoosedUsers.bind(this);

        return (
            <div>
                <button
                    className="waves-effect waves-light btn modal-trigger"
                    data-target="modalChooseUser"
                >
                    <i className="small material-icons">add</i>
                    Choose Users
                </button>

                <div id="modalChooseUser" className="modal">
                    <div className="modal-content">
                        <ul className="collection" onScroll={handleScroll}>
                            {list.map(item => {
                                let change = () => {
                                    this.addLikeChoose(item);
                                };

                                return (
                                    <li
                                        key={item._id}
                                        className="collection-item avatar"
                                    >
                                        <img
                                            src={item.avatar}
                                            alt=""
                                            className="circle"
                                        />
                                        <span className="title">
                                            {item.fullname} -{" "}
                                            <i>{item.keyword}</i>
                                        </span>
                                        <p>
                                            {" "}
                                            {item.username} - {item.email}{" "}
                                            <br />
                                            {item.lastMail.replace(
                                                "T",
                                                " "
                                            )} - {item.youtubeChannel}
                                            <br />
                                            {item.verified
                                                ? "Verified"
                                                : "NotVerified"}
                                        </p>
                                        <label className="secondary-content">
                                            <input
                                                type="checkbox"
                                                onChange={change}
                                                checked={
                                                    !!this.state.checked[
                                                        item._id
                                                    ]
                                                }
                                            />
                                            <span></span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <a
                            className="modal-close waves-effect waves-green btn-flat"
                            onClick={sendChoosedUsers}
                        >
                            {" "}
                            Add
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(ChooseUserModal);

/*
(state=>({
    list:  state.users.infinityLoad.list,
    token: state.users.token,
    isLoading: state.users.infinityLoad.isLoading,
    loaded: state.users.infinityLoad.loaded,
    all: state.users.infinityLoad.all,
}), dispatch=>({
    getUsers: (offset, limit, token)=>{
        dispatch({type: USER_ACTIONS.LOAD_MORE_USERS, data: { offset, limit, token }});
    },
}))
*/
