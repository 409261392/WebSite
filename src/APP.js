import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Container, Grid } from "semantic-ui-react";
import Header from "./Header";
import Signin from "./Page/Signin";
import Posts from "./Page/Posts";
import NewPost from "./Page/NewPost";
import Post from "./Page/Post";
import Topics from "./Components/Topics";
import MyMenu from "./Components/MyMenu";

function APP() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/posts" element={<PostViewLayout />}>
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:postid" element={<Post />} />
        </Route>

        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/new-post" element={<NewPost />}></Route>
        <Route path="/my" element={<MemberLayout />}>
          <Route path="/my/posts" element={"我的文章"} />
          <Route path="/my/collections" element={"我的收藏"} />
          <Route path="/my/settings" element={"會員資料"} />
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
          <Grid.Column width={3}><MyMenu /></Grid.Column>
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
