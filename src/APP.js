import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import React from "react";
import firebase from "./utils/firebase";
import { Container, Grid } from "semantic-ui-react";
import Header from "./Header";
import Signin from "./Page/Signin";
import Posts from "./Page/Posts";
import NewPost from "./Page/NewPost";
import Post from "./Page/Post";
import MyPosts from "./Page/MyPosts";
import Topics from "./Components/Topics";
import MyMenu from "./Components/MyMenu";
import MyCollections from "./Page/MyCollections";
import MySettings from "./Page/MySettings";

function APP() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((currentuser) => {
      setUser(currentuser);
    });
  }, []);
  return (
    <BrowserRouter>
      <Header user={user}/>
      <Routes>
        <Route path="/posts" element={<PostViewLayout />}>
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:postid" element={user ? <Post /> : <Navigate to='/posts'/>} />
        </Route>

        <Route path="/signin" element={user ? <Navigate to='/posts'/> : <Signin />}></Route>
        <Route path="/new-post" element={user ? <NewPost /> : <Navigate to='/posts'/>}></Route>
        
        <Route path="/my" element={user ? <MemberLayout /> : <Navigate to='/posts'/>}>
          <Route path="/my/posts" element={<MyPosts />} />
          <Route path="/my/collections" element={<MyCollections />} />
          <Route path="/my/settings" element={<MySettings user={user}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
const PostViewLayout = () => {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Topics />
          </Grid.Column>
          <Grid.Column width={10}>
            <Outlet />
          </Grid.Column>
          <Grid.Column width={3}>APP</Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
const MemberLayout = () => {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <MyMenu />
          </Grid.Column>
          <Grid.Column width={10}>
            <Outlet />
          </Grid.Column>
          <Grid.Column width={3}>APP</Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
export default APP;
