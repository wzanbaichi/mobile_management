import Encrypt from "../assets/js/encrypt"
import axios from 'axios'
import qs from 'qs'
import { resolve } from "path";
import { reject } from "rsvp";
export default async(url="", params={}, type="GET") => {
    return new Promise((resolve,reject) => {
        if(type === "GET") {
            axios.get(
                url,
                {
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