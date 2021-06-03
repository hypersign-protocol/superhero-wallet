import axios from "axios"
import { reject } from "bluebird"

class APICalls {

    handleResponse(response){
        if(!response){
            return { err: new Error("No repsonse")}            
        } 
        if(response.status >= 400 && response.status < 500){
            return { err: new Error("BAD REQUEST: Please try to refresh")}
        }
        if(response.status >= 500 && response.status < 512){
            return { err: new Error("INTERNAL SERVER ERROR: Please try agan after some time")}
        }
    
        return response.data
    }

    get(url){
        return new Promise((resolve, reject) => {
            axios.get(url).then(res => {
                const handledRes = this.handleResponse(res);
                resolve(handledRes);
            }).catch(err => {
                resolve({
                    err: err
                })
            })
        })
    
    }

    post(url, body){
        return new Promise((resolve, reject) => {
            axios.get(url, body).then(res => {
                const handledRes = this.handleResponse(res);
                resolve(handledRes);
            }).catch(err => {
                resolve({
                    err: err
                })
            })
        })
    }
}

export const apiCall = new APICalls();

