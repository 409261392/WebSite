import {
  Container,
  Grid,
  Image,
  Header,
  HeaderSubheader,
  Segment,
  Icon,
  Comment,
  Form,
} from "semantic-ui-react";
import Topics from "../Components/Topics";
import React, { useState } from "react";
import firebase from "../utils/firebase";
import { useParams } from "react-router-dom";

function Post() {
  const { postid } = useParams();
  const [post, setPost] = React.useState({
    author: {},
  });
  const [commentContent, setCommentContent] = React.useState("");
  const [isloading, setIsLoading] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .doc(postid)
      .onSnapshot((docSnapshot) => {
        const data = docSnapshot.data();
        setPost(data);
      });
  }, []);

  React.useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .doc(postid)
      .collection("comments")
      .orderBy("createdAt")
      .onSnapshot((collectionSnapshop) => {
        const data = collectionSnapshop.docs.map((doc) => {
          return doc.data();
        });
        setComments(data);
      });
  }, []);

  function toggle(isActive, field) {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection("posts")
      .doc(postid)
      .update({
        [field]: isActive
          ? firebase.firestore.FieldValue.arrayRemove(uid)
          : firebase.firestore.FieldValue.arrayUnion(uid),
      });
  }

  const iscollected = post.collectedBy?.includes(
    firebase.auth().currentUser.uid
  );
  const isliked = post.likedBy?.includes(firebase.auth().currentUser.uid);

  function onSubmit() {
    setIsLoading(true);
    const firestore = firebase.firestore();
    const batch = firestore.batch();
    const postRef = firestore.collection("posts").doc(postid);
    batch.update(postRef, {
      commentsCount: firebase.firestore.FieldValue.increment(1),
    });
    const commentRef = postRef.collection("comments").doc();
    batch.set(commentRef, {
      content: commentContent,
      createdAt: firebase.firestore.Timestamp.now(),
      author: {
        uid: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName || "",
        photoURL: firebase.auth().currentUser.photoURL || "",
      },
    });
    batch.commit().then(() => {
      setCommentContent("");
      setIsLoading(false);
    });
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Topics />
          </Grid.Column>
          <Grid.Column width={10}>
            {post.author.photoURL ? (
              <Image src={post.author.photoURL} />
            ) : (
              <Icon name="user circle"></Icon>
            )}
            {post.author.displayName || "使用者"}
            <Header>
              {post.title}
              <Header.Subheader>
                {post.topic}.{post.createdAt?.toDate().toLocaleDateString()}
              </Header.Subheader>
            </Header>
            <Image src={post.imageUrl} />
            <Segment basic vertical>
              {post.content}
            </Segment>
            <Segment basic vertical>
              留言{post.commentsCount || 0}•讚{post.likedBy?.length || 0}•
              <Icon
                name={`thumbs up${isliked ? "" : " outline"}`}
                color={isliked ? "blue" : "grey"}
                link
                onClick={() => toggle(isliked, "likedBy")}
              ></Icon>
              •
              <Icon
                name={`bookmark${iscollected ? "" : " outline"}`}
                color={iscollected ? "blue" : "grey"}
                link
                onClick={() => toggle(iscollected, "collectedBy")}
              ></Icon>
            </Segment>
            <Comment.Group>
              <Form reply>
                <Form.TextArea
                  value={commentContent}
                  onChange={(e) => {
                    setCommentContent(e.target.value);
                  }}
                />
                <Form.Button onClick={onSubmit} loading={isloading}>
                  留言
                </Form.Button>
              </Form>
              <Header>{post.commentsCount || 0}則留言</Header>
              {comments.map((comment) => {
                return (
                  <Comment>
                    <Comment.Avatar src={comment.author.photoURL} />
                    <Comment.Content>
                      <Comment.Author as="span">
                        {comment.author.displayName || "使用者"}
                      </Comment.Author>
                      <Comment.Metadata>
                        {" "}
                        {comment.createdAt.toDate().toLocaleString()}
                      </Comment.Metadata>
                      <Comment.Text>{comment.content}</Comment.Text>
                    </Comment.Content>
                  </Comment>
                );
              })}
            </Comment.Group>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
export default Post;
