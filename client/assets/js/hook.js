import {useState} from 'react'
import app from '../utils/socket'

export const useInputValue = (initial, schema)=>{
    const [ value, setValue ] = useState(initial)
    const [ error, setErr ] = useState('')
    const onChange = (e,val)=>{
        setValue(e?e.target.value:val)
        if(schema) {
            if(schema.validate(value).error) {
                setErr(schema.validate(value).error.details[0].message)
            } else {
                setErr(false)
            }
            
        }
    }
    const onFocus = onChange;
    return { value, onChange, onFocus, error }
}

export const findUsers = (props)=>{
    app.service('users').find()
    .then(res=>{
        console.log(res.data);
        
        props.saveUsers(res)
        props.saveUsersParam(res)
    })
    .catch(err=>console.log(err));
}