import React, { Component } from 'react';

class PopUpConfirmAction extends Component{
    constructor(props){
        super(props)

        
    }

    handleClose(){
        if(this.props.onClose) this.props.onClose();
    }

    handleConfirm(){
        if(this.props.onSubmit) this.props.onSubmit();
    }

    render(){
        let { count, action } = this.props;
        let handleClose = this.handleClose.bind(this);
        let handleConfirm = this.handleConfirm.bind(this);
        

        return <div className="overlay-element">
            <div className="card popup-card"> 
                
                <div className="card-content">
                    {count?<p> Do you really want to {action} {count} items? </p>:<p> You don't choose any item </p>}
                </div>
                <div className="card-action">
                    <button className="btn" onClick={handleClose} > CLOSE </button>
                    {count?<button className="btn" onClick={handleConfirm} >CONFIRM</button>:<span></span>}
                </div>
             </div>
             
        </div>
    }
}

export default PopUpConfirmAction;