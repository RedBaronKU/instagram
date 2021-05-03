import './App.css';
import Post from './Post.js'
import React, {useState,useEffect} from 'react'
import {db} from './firebase.js'
import { Input } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {auth} from './firebase.js'
import ImageUpload from './ImageUpload'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Navbar,Button,Nav} from 'react-bootstrap'
// import InstagramEmbed from 'react-instagram-embed';

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
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
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
       .catch((error)=>console.log(error.message));
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
            <Navbar className="navi" bg="light" expand="lg">
            <Navbar.Brand href="#" className="mr-auto">
            <img
                src="https://i.pinimg.com/originals/57/6c/dd/576cdd470fdc0b88f4ca0207d2b471d5.png"
                className="navbar_logo mr-auto"
                alt="Instagram">    
            </img>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              
              <Nav className="ml-auto">
              {
                user ? (
                  <div >
                    <Button onClick={()=>auth.signOut()}>Logout</Button>
                  </div>
                ):
                (
                <div className="app__loginContainer container">
                  <Button className="btn btn-danger"onClick={()=>setopensignIN(true)}>Sign In</Button>
                  <Button onClick={()=>setOpen(true)}>SignUp</Button>
                </div>
                )  
              }
              </Nav>
          </Navbar.Collapse>
          </Navbar> 
        </div>

      { user?.displayName ? (
        <ImageUpload username={user.displayName}></ImageUpload>
        ):(
          <h3>Sorry, you need to Login to upload, Head up to SignUp Now and start posting....</h3>
        )
      }
      <div className="Allpost col-xl-8 col-lg-8 offset-md-2">      
      {
        posts.map(({id,post}) => (
         <Post key={id} user={user} postID={id} username={post.username} caption={post.caption} imageURL={post.imageURL} avatarURL={post.avatarURL}/>
        ))
      }
      </div>
      {/* <InstagramEmbed
        url='https://www.instagram.com/p/COXoZELHOJb/'
        clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      /> */}

    </div>
  );
}

export default App;
