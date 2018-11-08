import Encrypt from "../assets/js/encrypt"
import axios from 'axios'
import qs from 'qs'

var root = '';
export default async(url="", params={}, type="GET") => {
    if(window.location.href.indexOf("platform") > 0) {
        root = window.location.href.split("platform")[0];
    }
    return new Promise((resolve,reject) => {
        if(type === "GET") {
            axios.get(
                url,
                {
                    baseURL: root,
                    params:params,
                    headers:{
                        "Authorization": Encrypt.encryptStr('timestamp=' + params.timestamp)
                    }
                }
            )
            .then(response=> {
                
                resolve(response)
            })
            .catch(response=> {
            });
        }
        if(type === "POST") {
            axios.post(
                url,
                qs.stringify(params),
                {
                    baseURL: root,
                    headers:{
                        "Authorization": Encrypt.encryptStr('timestamp=' + params.timestamp)
                    }
                }
            )
            .then(response=> {
                resolve(response)
            })
            .catch(response=> {
            });
        }
    })
    
}