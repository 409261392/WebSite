import { BrowserRouter , Routes, Route } from "react-router-dom";
import Header from "./Header";
import Signin from "./Page/Signin";
import Posts from "./Page/Posts";
import NewPost from "./Page/NewPost";
import Post from "./Page/Post";


function APP(){
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Posts />} ></Route>
                <Route path='/signin' element={<Signin />} ></Route>
                <Route path='/new-post' element={<NewPost />} ></Route>
                <Route path='/posts/:postid' element={<Post />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default APP;