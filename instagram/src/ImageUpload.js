import React,{useState} from 'react'
import firebase from 'firebase'
import {storage,db} from "./firebase.js"
import './ImageUpload.css'
import {Button} from 'react-bootstrap'

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
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url=>{
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption:caption,
                            imageURL:url,
                            username:username,
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
                }
            )
    }

    return (
        <div className="uploader col-8 offset-md-2">
           <input type="file" onChange={handleChange} id=""/> 
           <input type="text" placeholder='Enter a caption...' className="caption" onChange={event=>setCaption(event.target.value)} value={caption}/>
           <Button className="btn btn-info" onClick={handleUpload}>Upload</Button> 
        </div>
    )
}

export default ImageUpload
