import { Button } from '@material-ui/core'
import React,{useState} from 'react'
import firebase from 'firebase'
import {storage,db} from "./firebase.js"

function ImageUpload({username}) {
    const[caption,setCaption]=useState('');
    const[image,setImage]=useState(null);
    const[progress,setProgress]=useState(0);
    
    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload=()=>{
            const uploadTask=storage.ref(`images/${image.name}`).put(image);

            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress=Math.round(
                        (snapshot.byteTransferred/snapshot.totalBytes)*100,
                    );
                    setProgress(progress);
                },
                (error)=>{
                    console.log(error);
                    alert(error.message);
                },
                ()=>{
                    storage
                    .ref("image")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url=>{
                        db.collections("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption:caption,
                            imageURL:url,
                            username:username,
                        })
                    })
                }
            )
    }

    return (
        <div>
           <input type="text" placeholder='Enter a caption...' className="caption" value={caption}/>
           <input type="file" onChange={handleChange} id=""/>   
           <Button onClick={handleUpload}>Upload</Button> 
        </div>
    )
}

export default ImageUpload
