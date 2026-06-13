import {io} from 'socket.io-client'

let socketInstance = null;

export const initializeSocket = (projectId) =>{
    socketInstance = io(import.meta.env.VITE_API_URL,{
        auth:{
            token: localStorage.getItem('token')
        },
        query:{
            projectId
        }
    });

    return socketInstance;
}
export const receiveMessage = (evetName,cb)=>{
    socketInstance.on(evetName,cb);
}
export const sendMessage = (evetName,data)=>{
    // console.log(socketInstance);
    
    socketInstance.emit(evetName,data);
}
