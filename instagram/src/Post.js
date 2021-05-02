import React from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';

function Post({username,caption,imageURL,avatarURL}) {
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

        </div>
    )
}

export default Post
