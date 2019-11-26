import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PopUpConfirmAction from './popup-confirm-action';


class TableListComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {

            showConfirmAction: false,
            actionName: "",
            actionItems: [],
            countItems: 0,
            checked: {

            },
            selectAll: false
        }
    }
    componentDidMount() {
        if (typeof document !== "undefined") {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
        }
    }

    handleChangePage(active) {
        let { limit, all } = this.props;
        let offset = (active - 1) * limit;
        return () => {
            if (this.props.changePage) {
                this.props.changePage(offset, limit);
            }
        }
    }

    handleTableCheckboxClick(user) {
        return () => {
            let { checked } = this.state;
            if (checked[user._id]) {
                delete checked[user._id];
                this.setState({
                    checked: checked,
                    selectAll: false
                })
            } else {
                checked[user._id] = user;
                this.setState({
                    checked: checked
                })
            }


            if (this.props.onItemSelect) this.props.onItemSelect(checked);

        }
    }

    selectAll() {
        if (this.state.selectAll) {
            this.setState({
                selectAll: false
            })
        } else {
            let { list } = this.props;
            let { selectAll, checked } = this.state;

            for (let i = 0; i < list.length; i++) {
                checked[list[i]._id] = list[i];

            }

            this.setState({
                checked: checked,
                selectAll: true
            })
        }

        if (this.props.onItemSelect) this.props.onItemSelect(checked);
    }

    handleChnageSelect(event) {
        //console.log(event.currentTarget.value);

        //if(event.currentTarget.value){

        this.setState({
            actionName: event.currentTarget.value
        })
        //}
    }

    handleClose() {
        this.setState({
            showConfirmAction: false
        })
    }

    handleSubmit() {
        this.setState({
            showConfirmAction: false,
            actionItems: [],
            countItems: 0,
            checked: {

            },
            selectAll: false
        })

        if (this.props.makeAction) this.props.makeAction(this.state.actionName, this.state.actionItems);
    }

    handleClickGo() {
        if (this.state.actionName) {
            let { checked } = this.state;
            let count = 0;
            let items = []
            for (const key in checked) {
                if (checked.hasOwnProperty(key)) {
                    count++;
                    items.push(key);
                }
            }

            this.setState({
                countItems: count,
                actionItems: items,
                showConfirmAction: true
            })

        }
    }

    suspendUser(user) {
        console.log(user)
        console.log('suspend')
    }

    render() {
        let { list, offset, limit, all } = this.props;
        let { checked, selectAll } = this.state
        let active = Math.ceil(offset / limit) + 1;
        let pagesNum = Math.ceil(all / limit);
        let { showConfirmAction, actionName, countItems } = this.state;

        let handleChnageSelect = this.handleChnageSelect.bind(this);
        let handleClickGo = this.handleClickGo.bind(this);
        let suspendUser = this.suspendUser.bind(this);
        let handleClose = this.handleClose.bind(this);
        let handleSubmit = this.handleSubmit.bind(this);

        let pages = [];
        for (let i = 0; i < pagesNum; i++) {
            pages.push(i + 1);
        }
        return (<div>
            <div className="input-field inline" style={{ minWidth: '255px' }}>
                <select defaultValue="" onChange={handleChnageSelect}>
                    <option value="" disabled > --------- Choose Action -------</option>
                    <option value="remove">Remove</option>
                </select>
            </div>
            <button className="btn" onClick={handleClickGo}> GO </button>
            <table>
                <thead>
                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" checked={selectAll} className="filled-in" onChange={this.selectAll.bind(this)} />
                                <span></span>
                            </label>
                        </th>
                        <th> Avatar </th>
                        <th> Fullname </th>
                        <th> Status </th>
                        <th> Username </th>
                        <th> Is Verified </th>
                        <th> Code </th>
                        <th> Lenguage </th>
                        <th> Category </th>
                        <th> Email Address </th>
                        <th> Number of followers </th>
                        <th> Notifications Enabled </th>
                        <th> YT Video </th>
                    </tr>
                </thead>

                <tbody>
                    {list.map((user) => {
                        return <tr key={user._id}>
                            <td>
                                <label>
                                    <input type="checkbox" className="filled-in" checked={checked[user._id] ? true : false} onChange={this.handleTableCheckboxClick(user)} />
                                    <span></span>
                                </label>
                            </td>
                            <td> <img className="avatar-profile-table" src={user.avatar} /> </td>
                            <td> {user.fullname} </td>
                            <td>
                                <button className="btn" onClick={suspendUser(user)}> Suspend </button>
                            </td>
                            <td> {user.username} </td>
                            <td> {user.verified ? <i className="material-icons" style={{ color: "green" }}>verified_user</i> : <i className="material-icons" style={{ color: "red" }}>cancel</i>} </td>
                            <td> {user.validationCode ? user.validationCode : ""} </td>
                            <td> {user.language} </td>
                            <td> {user.keyword} </td>
                            <td> {user.email} </td>
                            <td> {(user.followers || []).length} </td>
                            <td> {user.notificationPush ? <i className="material-icons" style={{ color: "green" }}>verified_user</i> : <i className="material-icons" style={{ color: "red" }}>cancel</i>} </td>
                            <td> <Link to={"/admin/users/" + user._id + "/videos"}>{user.video}</Link> </td>
                        </tr>
                    })}
                </tbody>
            </table>
            {all > limit ? (<ul className="pagination" >
                <li className={(active - 1) > 0 ? "waves-effect" : "disabled"} onClick={this.handleChangePage((active - 1) > 0 ? (active - 1) : 0)}><a ><i className="material-icons">chevron_left</i></a></li>
                {pages.map((item) => {
                    return <li key={item} className={item === active ? "active" : "waves-effect"} onClick={this.handleChangePage(item)}><a>{item}</a></li>
                })}
                <li className={active < pagesNum ? "waves-effect" : "disabled"} onClick={this.handleChangePage(active < pagesNum ? (active + 1) : pagesNum)}><a ><i className="material-icons">chevron_right</i></a></li>
            </ul>) : (<div></div>)}

            {showConfirmAction ? <PopUpConfirmAction action={actionName} count={countItems} onClose={handleClose} onSubmit={handleSubmit} /> : <span></span>}
        </div>);
    }
}

export default TableListComponent;