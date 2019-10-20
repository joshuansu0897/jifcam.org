import axios from 'axios'

export function authUser(username, password){
    //console.log('authUser action');
    let promise = new Promise((resolve, reject)=>{
        axios.post('/api/users/auth', {
            username: username,
            password: password
        }).then((response)=>{
            resolve(response.data);
        }).catch((err)=>{
            reject(err);
        })
    });

    return promise;
}

export function getUserList(offset, limit, token){
    let promise = new Promise((resolve, reject)=>{
        axios.get('/api/users?offset=' + offset + '&limit=' + limit, {
            headers:{"Authorization": "Bearer " + token}
        }).then((response)=>{
            resolve(response.data);
        }).catch((err)=>{
            reject(err);
        });
    });

    return promise;
}

export function imporUserData(formData, token){
    let promise = new Promise((resolve, reject)=>{
        axios.post('/api/users/import', formData, {  headers:{"Authorization": "Bearer " + token} }).then((response)=>{
            resolve(response.data);
        }).catch((err)=>{
            reject(err);
        })
    }); 

    return promise;
}

export function getInfoVerified(token){
    let promise = new Promise((resolve, reject)=>{
        axios.get("/api/users/verify/count/", {  headers:{"Authorization": "Bearer " + token} }).then((response)=>{
          
            resolve(response.data);
        }).catch((err)=>{
            reject(err);
        })
    })

    return promise;
}

export function getOneUserData(id, token){

    let promise = new Promise((resolve, reject)=>{
        axios.get("/api/users/" + id, {  headers:{"Authorization": "Bearer " + token} }).then((response)=>{
            resolve(response.data);
        }).catch((err)=>{
            reject(err);
        })
    });

    return promise;
}

export function sendVerificationEmails(data, token){
    console.log("sendVerificationEmails", data, token);
    let promise = new Promise((resolve, reject)=>{
        axios.post("/api/users/mail", data, {  headers:{"Authorization": "Bearer " + token} }).then((response)=>{
            resolve(response.data);
        }).catch((err)=>{
            reject(err);
        })
    })

    return promise;
}

export function removeUsers(list, token){
    let promise = new Promise((resolve, reject)=>{
        axios.post("/api/users/remove", { list: list }, {  headers:{"Authorization": "Bearer " + token} }).then((response)=>{
            resolve(response.data);
        }).catch((err)=>{
            reject(err);
        })
    })

    return promise;
}

export function getUserVideos(offset, token){
    let promise = new Promise((resolve, reject)=>{
        const url = typeof offset === 'number' && offset > 0 ? `/api/videos/master/list/${offset}` : "/api/videos/master/list"
        axios.get(url, {  headers:{"Authorization": "Bearer " + token} }).then((response)=>{
            resolve(response.data);
        }).catch((err)=>{
            reject(err);
        })
    })

    return promise;
}
