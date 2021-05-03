import React,{useState,useEffect} from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase'
import firebase from 'firebase'


function Post({user,postID,username,caption,imageURL,avatarURL}) {
    const[comments,setComments]=useState([]);
    const[comment,setComment]=useState('');
    useEffect(() => {
        let unsubscribe;
        if(postID){
            unsubscribe=db
            .collection("posts")
            .doc(postID)
            .collection("comments")
            .orderBy('timestamp')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()));
            })
        }
        return () => {
            unsubscribe()
        }
    }, [postID])

    const postComment=(event)=>{
        event.preventDefault();
        db.collection("posts").doc(postID).collection("comments").add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })  
        setComment('');
    }
    return (
        <div className="post">   
            <div className="postHeader">
                <Avatar
                    className="postAvatar"
                    alt={username}
                    src={avatarURL}>

                </Avatar>
                <h3>{username}</h3>
            </div>
            <img 
            src={imageURL}
            className="postImage"
            alt="Noice"></img>
            <h4 className="postText"><strong>{username}</strong>  {caption}</h4>
            <p className="viewcomments">View all comments</p>
            <div className="postcomments">
                {comments.map((comment)=>(
                    <p>
                        <strong>{comment.username}</strong>  {comment.text}
                    </p>
                ))}
            </div>
                    
            { user && 
                (<form className="commentbox">
                <input type="text" 
                    className="postinput"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                />
                <button 
                disabled={!comment}
                className="postbutton btn btn-link"
                type="Submit"
                onClick={postComment}>Post</button>
                </form>
            )}
        </div>
    )
}

export default Post
