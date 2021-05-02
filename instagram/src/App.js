import './App.css';
import Post from './Post.js'
import React, {useState,useEffect} from 'react'
import {db} from './firebase.js'
import { Button,Input } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {auth} from './firebase.js'
import ImageUpload from './ImageUpload'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts,setPosts]=useState([]);
  
  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post: doc.data()
      })))
    });
  }, [posts])
    
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open,setOpen]=useState(false);
    const [opensignIN,setopensignIN]=useState(false);
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [user,setuser]=useState(null);
    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                console.log(user);
                setuser(authUser);
                // if(authUser.displayName){
                   
                // }
                // else{
                //     return authUser.updateProfile({
                //          displayName : username,
                //     });
                // }
            }
            else{
                setuser(null);
            }
        })

        return()=>{
          unsubscribe();
        }
    },[user,username]);

    const signup = (event) => {
       event.preventDefault();
       //console.log(`${username}:${email}:${password}`);
       auth.createUserWithEmailAndPassword(email, password)
       .then((authUser)=>{
         return authUser.user.updateProfile({
           displayName: username,
         })
       })
       .catch((error)=>alert(error.message));
       setOpen(false);
    }
    
    const signin = (event) => {
       event.preventDefault();
       //console.log(`${username}:${email}:${password}`);
       auth.signInWithEmailAndPassword(email, password)
       .catch((error)=>alert(error.message));
       setopensignIN(false);
    }
  return (
    <div className="App">
    
      <div className="navbar">
            <Modal
                open={open}
                onClose={()=>setOpen(false)}
            >
                <center style={modalStyle} className={classes.paper}>
                    <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
                    <form className="signUp">
                    <Input 
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}/>
                    
                    <Input type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>
                    
                    <Input type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}/>
                    <Button type="submit" onClick={signup}>Submit</Button>
                    </form>
                </center>
            </Modal>
            <Modal
                open={opensignIN}
                onClose={()=>setopensignIN(false)}
            >
                <center style={modalStyle} className={classes.paper}>
                    <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
                    <form className="signIN">
                    
                    <Input type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>
                    
                    <Input type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}/>
                    <Button type="submit" onClick={signin}>Submit</Button>
                    </form>
                </center>
            </Modal>
            <img
                src="https://i.pinimg.com/originals/57/6c/dd/576cdd470fdc0b88f4ca0207d2b471d5.png"
                className="navbar_logo"
                alt="Instagram">    
            </img>
            <input type="text" placeholder="Search" className="navbarSearch"></input>
            {
              user ? (
                <Button onClick={()=>auth.signOut()}>Logout</Button>
              ):
              (
              <div classname="app__loginContainer">
                <Button onClick={()=>setopensignIN(true)}>Sign In</Button>
                <Button onClick={()=>setOpen(true)}>SignUp</Button>
              </div>
              )  
            }
        </div>
            
      {
        posts.map(({id,post}) => (
         <Post username={post.username} caption={post.caption} imageURL={post.imageURL} avatarURL={post.avatarURL}/>
        ))
      }
      { user.displayName ? (
        <ImageUpload username={user.displayName}></ImageUpload>
      ):(
        <h3>Sorry, you need to Login to continue</h3>
      )
      }
      

    </div>
  );
}

export default App;
