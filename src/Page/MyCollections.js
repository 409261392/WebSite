import { Item,Header } from "semantic-ui-react";
import React, { useState } from "react";
import firebase from "../utils/firebase";
import Post from "../Components/Post";

function MyCollections() {
  const [post, setPosts] = useState([]);
  React.useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .where("collectedBy","array-contains",firebase.auth().currentUser.uid)
      .get()
      .then((collectionSnapshot) => {
        const data = collectionSnapshot.docs.map((docSnapshot) => {
          const id = docSnapshot.id;
          return { ...docSnapshot.data(), id };
        });
        setPosts(data);
      });
  }, []);
  return (
    <>
        <Header>我的收藏</Header>
        <Item.Group>
        {post.map((post) => {
            return <Post post={post} key={post.id}/>;
        })}
        </Item.Group>
    </>
  );
}

export default MyCollections;
