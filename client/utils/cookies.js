
let setCookie = (name, value, hours)=>{

}

let getCookie = (name) => {
}


let  deleteCookie = (name)=> {

}

if(typeof window !== 'undefined'){ 
  /*global.window = {document: {createElementNS: () => {return { } },  cookie: { match: ()=>{  }} }};
  
var document = window.document;*/
setCookie = function (name, value, hours){
    if(typeof hours !== 'number'){ hours = 1 }
    let date = new Date(new Date().getTime() + hours * 60 * 60 * 1000);
    if(typeof window !== 'undefined'){ document.cookie = name + "=" + value + '; path=/; expires=' + date.toUTCString(); }
  }

  getCookie =  function (name){
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    if(typeof window !== 'undefined'){ return matches ? decodeURIComponent(matches[1]) : null; }
  }

  deleteCookie = function (name) {
    setCookie(name, "", {
      expires: -1
    })
  }
  
}


export { setCookie, getCookie, deleteCookie }