import React, { Component } from "react";
import connect from "../../assets/redux/connect";
import { Link, Redirect } from "react-router-dom";
import { login } from "../../utils/authenticator";
class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.usernameInput = React.createRef();
        this.passwordInput = React.createRef();
    }

    renderForm() {
        const { users } = this.props;
        const handleSubmit = this.handleSubmit.bind(this);
        return (
            <form>
                {users.status === 1 ? (
                    <div>
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
                {users.status === 3 ? (
                    <div>
                        {" "}
                        <p className="notice notice-error">
                            {" "}
                            Field Authentication try again{" "}
                        </p>{" "}
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="input-field col s12">
                    <input
                        id="username"
                        type="text"
                        className="validate"
                        ref={input => {
                            this.usernameInput = input;
                        }}
                    />
                    <label htmlFor="username">username</label>
                </div>
                <div className="input-field col s12">
                    <input
                        id="password"
                        type="password"
                        className="validate"
                        ref={input => {
                            this.passwordInput = input;
                        }}
                    />
                    <label htmlFor="password">password</label>
                </div>
                <div className="action-buttons">
                    <a
                        className="waves-effect waves-light btn"
                        onClick={handleSubmit}
                    >
                        Login
                    </a>
                </div>
            </form>
        );
    }

    async handleSubmit() {
        let username = this.usernameInput.value;
        let password = this.passwordInput.value;
        await login(await this.props.AuthUser({ username, password }));
    }

    render() {
        const { users } = this.props;
        if (users.token) {
            return <Redirect to="/admin/dashboard" />;
        }

        return (
            <div>
                <div className="LoginPage" style={{ color: "#333333" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col m3 s12"></div>

                            <div className="col m6 s12">
                                <div className="card login-card">
                                    <div className="card-content">
                                        <span className="card-title">
                                            Login
                                        </span>
                                        {this.renderForm()}
                                    </div>
                                </div>

                                <p style={{ textAlign: "center" }}>
                                    {" "}
                                    <Link to="/"> Got to Home </Link>{" "}
                                </p>
                            </div>
                            <div className="col m3 s12"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(LoginPage);
