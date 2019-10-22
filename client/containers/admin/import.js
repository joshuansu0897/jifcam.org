import React, { Component } from "react";
import connect from "../../assets/redux/connect";
import { Redirect } from "react-router-dom";
import ImportFrom from "../../components/import-form";

class ImportPage extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
    }

    handleSubmit(formData) {
        let { token } = this.props.users;
        this.props.requestImport({ formData, token });
    }

    handleReset() {
        this.props.resetImport();
    }

    render() {
        let {
            users: { importStatus: status, importData, token }
        } = this.props;
        let handleSubmit = this.handleSubmit.bind(this);
        let handleReset = this.handleReset.bind(this);
        if (!token) {
            return <Redirect to="/admin"></Redirect>;
        }
        return (
            <div>
                <div className="ImportPage">
                    <div className="container">
                        <div className="row">
                            <div className="col s12">
                                <h3> Import data </h3>
                            </div>
                            <div className="col s12">
                                <ImportFrom
                                    status={status}
                                    importData={importData}
                                    onSubmit={handleSubmit}
                                    onReset={handleReset}
                                ></ImportFrom>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(ImportPage);

/*
(state=>({
    user: state.users.logged,
    token: state.users.token,
    status: state.users.requestStatuses.import,
    importData: state.users.importResults
}), dispatch=>({
    requestImport: (formData, token )=>{
        dispatch({type: USER_ACTIONS.REQUEST_IMPORT, data: { formData: formData, token: token } })
    },
    reset: ()=>{
        dispatch({type: USER_ACTIONS.REQUEST_IMPORT});
    }
}))
*/
