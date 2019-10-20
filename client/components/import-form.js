import React, { Component } from 'react';

class ImportFrom extends Component{
    constructor(props){
        super(props);
        this.fileInput = React.createRef();
    }

    handleSubmit(){
        let formData = new FormData();
        formData.append("document", this.fileInput.files[0]);
        this.props.onSubmit(formData);
    }

    handleReset(){
        this.props.onReset();
    }

    render(){
        let { status, importData } = this.props;
        let handleSubmit = this.handleSubmit.bind(this);
        let handleReset = this.handleReset.bind(this);

        return (<div>
            {status===0?(<form>
                <div className="file-field input-field">
                    <div className="btn">
                        <span> SELECT CSV </span>
                        <input type="file" accept=".csv" ref={(input)=>{
                            this.fileInput = input;
                        }} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <div className="actions"> 
                    <button type="button" className="btn light-blue darken-4" onClick={handleSubmit} > IMPORT </button>
                </div>
            </form>):<div></div>}
            {status===1?(<div>
                <p className="notice"> Import in progress, It can take a few minutes </p>
                <div className="preloader-wrapper big active">
                    <div className="spinner-layer spinner-blue">
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
            </div>):<div></div>}
            {status===2?(<div>
                <button type="button" className="btn pink darken-3" onClick={handleReset}> Import more </button>
                <div>
                    <ul className="collection">
                        <li className="collection-item">Successful completed <span className="result">{importData.created}</span></li>
                        <li className="collection-item">Filed to import <span className="result">{importData.fieled}</span></li>
                    </ul>
                    <table className="errors-table">
                        <tbody>
                            { importData.errors.map((error)=>{
                                return <tr key={error.email}> 
                                    <td> {error.username} </td>
                                    <td> {error.email} </td>
                                    <td> {error.message} </td>
                                </tr>
                            }) }
                        </tbody>
                    </table>
                </div>
            </div>):<div></div>}
        </div>)
    }
}

export default ImportFrom;