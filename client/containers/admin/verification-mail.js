import React, { Component } from "react";
import connect from "../../assets/redux/connect";
import { Link, Redirect } from "react-router-dom";
import ChooseUserModal from "../modals/choose-user";

class VerificationMailPage extends Component {
    constructor(props) {
        super(props);

        this.titleInput = React.createRef();
        this.bodyInput = React.createRef();
        this.emailInput = React.createRef();
        this.sendgridKeyInput = React.createRef();

        this.state = {
            checked: {},
            list: []
        };
    }

    handleChooseUsers(users) {
        let { checked, list } = this.state;

        checked = Object.assign({}, checked, users);

        list = [];
        for (const key in checked) {
            if (checked.hasOwnProperty(key)) {
                list.push(checked[key]);
            }
        }

        this.setState({
            checked: checked,
            list: list
        });
    }

    handleSubmit() {
        let subject = this.titleInput.value;
        let emailFrom = this.emailInput.value;
        let messageTxt = this.bodyInput.value;
        let sendgridKey = this.sendgridKeyInput.value;

        let repalceText = messageTxt.replace(/(?:\r\n|\r|\n)/g, "<br/>");
        let messageHtml = "<p>" + repalceText + "</p>";
        messageTxt = encodeURI(messageTxt);
        messageHtml = encodeURI(messageHtml);

        let userIds = [];

        for (let i = 0; i < this.state.list.length; i++) {
            userIds.push(this.state.list[i]._id);
        }

        let data = {
            userIds: userIds,
            subject: subject,
            messageTxt: messageTxt,
            messageHtml: messageHtml,
            from: emailFrom,
            sendgridKey: sendgridKey
        };
        let token = this.props.users.token;

        this.props.sendMails({ data, token });
    }

    removeUserFromList(id) {
        let { checked, list } = this.state;
        delete checked[id];

        checked = Object.assign({}, checked);

        list = [];
        for (const key in checked) {
            if (checked.hasOwnProperty(key)) {
                list.push(checked[key]);
            }
        }

        this.setState({
            checked: checked,
            list: list
        });
    }

    reset() {
        this.setState({
            checked: {},
            list: []
        });
        this.props.resetMails();
    }
    render() {
        let handleChooseUsers = this.handleChooseUsers.bind(this);
        let handleSubmit = this.handleSubmit.bind(this);
        let reset = this.reset.bind(this);
        let list = this.state.list;
        let { mailsStatus } = this.props.users;

        return (
            <div>
                <div className="PageDashboard">
                    <div className="container">
                        <div className="row">
                            <div className="col s12">
                                <h3> Verification Mail </h3>
                                <div className="forms-holder">
                                    <div className="input-field col s12">
                                        <input
                                            placeholder="Title"
                                            id="title"
                                            ref={input => {
                                                this.titleInput = input;
                                            }}
                                            type="text"
                                            className="validate"
                                            defaultValue="Last chance to Claim your channel"
                                        />
                                        <label
                                            htmlFor="title"
                                            className="active"
                                        >
                                            Title
                                        </label>
                                    </div>
                                    <div className="input-field col s12">
                                        <textarea
                                            id="body"
                                            className="materialize-textarea"
                                            style={{ height: "192px" }}
                                            ref={input => {
                                                this.bodyInput = input;
                                            }}
                                            rows="10"
                                            defaultValue={`
    Hello,

    Claim your account

    #LINK 

        Thanks.
                                    `}
                                        ></textarea>

                                        <label
                                            className="active"
                                            htmlFor="body"
                                        >
                                            Body
                                        </label>
                                    </div>
                                    <div className="input-field col s12">
                                        <input
                                            id="email"
                                            type="email"
                                            className="validate"
                                            ref={input => {
                                                this.emailInput = input;
                                            }}
                                            defaultValue={"jifcam@gmail.com"}
                                        />
                                        <label
                                            htmlFor="email"
                                            className="active"
                                        >
                                            From Email
                                        </label>
                                    </div>
                                    <div className="input-field col s12">
                                        <input
                                            id="sendgrid_key"
                                            type="text"
                                            className="validate"
                                            ref={input => {
                                                this.sendgridKeyInput = input;
                                            }}
                                            defaultValue={""}
                                        />
                                        <label
                                            htmlFor="sendgrid_key"
                                            className="active"
                                        >
                                            Sendgrid key
                                        </label>
                                    </div>
                                    <div className="col s12">
                                        <ul className="collection">
                                            {list.map(item => {
                                                let remove = () => {
                                                    this.removeUserFromList(
                                                        item._id
                                                    );
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
                                                            {item.fullname}
                                                        </span>
                                                        <p>
                                                            {" "}
                                                            {
                                                                item.username
                                                            } - {item.email}{" "}
                                                            <br />
                                                            {item.lastMail.replace(
                                                                "T",
                                                                " "
                                                            )}{" "}
                                                            -{" "}
                                                            {
                                                                item.youtubeChannel
                                                            }
                                                            <br />
                                                            {item.verified
                                                                ? "Verified"
                                                                : "NotVerified"}
                                                        </p>
                                                        <a
                                                            className="secondary-content"
                                                            onClick={remove}
                                                        >
                                                            <i className="material-icons">
                                                                cancel
                                                            </i>
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <ChooseUserModal
                                            onChoose={handleChooseUsers}
                                        />
                                    </div>

                                    <div className="col s12">
                                        <p>
                                            <button
                                                className="waves-effect waves-teal btn"
                                                onClick={handleSubmit}
                                            >
                                                Send{" "}
                                                <i className="material-icons">
                                                    send
                                                </i>
                                            </button>
                                        </p>
                                    </div>
                                    {mailsStatus === 0 ? (
                                        <div></div>
                                    ) : (
                                        <div className="overlay-block">
                                            {mailsStatus === 1 ? (
                                                <div>
                                                    <div className="preloader-wrapper big active">
                                                        <div className="spinner-layer spinner-blue-only">
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
                                                <div>
                                                    {mailsStatus === 2 ? (
                                                        <p className="notice notice-success">
                                                            {" "}
                                                            Emails was sended{" "}
                                                        </p>
                                                    ) : (
                                                        <p className="notice notice-error">
                                                            {" "}
                                                            Field ending email
                                                            try again{" "}
                                                        </p>
                                                    )}
                                                    <button
                                                        className="waves-effect waves-teal btn"
                                                        onClick={reset}
                                                    >
                                                        {" "}
                                                        Reset{" "}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(VerificationMailPage);

/*

(state=>({
    status: state.users.requestStatuses.mails,
    token: state.users.token
}), dispatch=>({
    sendMails: (data, token)=>{
        //console.log(" sendMails ",data, token);
        dispatch({ type: USER_ACTIONS.REQEUST_SEND_VERIFICATION_EMAILS, data: data, token: token })
    },
    reset: ()=>{
        dispatch({ type: USER_ACTIONS.RESET_MAIL_STATUS });
    }
}))
*/
