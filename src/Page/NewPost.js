import React from "react";
import { Container, Header, Form, Image, Button } from "semantic-ui-react";
import "firebase/compat/firestore";
import firebase from "../utils/firebase";
import { Navigate, useNavigate } from "react-router-dom";

function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [topics, setTopics] = React.useState([]);
  const [topicName, setTopicName] = React.useState("");
  const [file, setFile] = React.useState(null);

  React.useEffect(() => {
    firebase
      .firestore()
      .collection("topics")
      .get()
      .then((collectionSnapshot) => {
        const data = collectionSnapshot.docs.map((doc) => {
          return doc.data();
        });
        setTopics(data);
      });
  }, []);

  const options = topics.map((topic) => {
    return {
      text: topic.name,
      value: topic.name,
    };
  });

  const previewUrl = file
    ? URL.createObjectURL(file)
    : "https://react.semantic-ui.com/images/wireframe/image.png";
  function onSubmit() {
    const documentRef = firebase.firestore().collection("posts").doc();
    const fileRef = firebase.storage().ref("post-image/" + documentRef.id);
    const metadata = {
      contentType: file.type,
    };
    fileRef.put(file, metadata).then(() => {
      fileRef.getDownloadURL().then((imageUrl) => {
        documentRef
          .set({
            title,
            content,
            topic: topicName,
            createdAt: firebase.firestore.Timestamp.now(),
            author: {
              displayName: firebase.auth().currentUser.displayName || "",
              photoURL: firebase.auth().currentUser.photoURL || "",
              uid: firebase.auth().currentUser.uid,
              email: firebase.auth().currentUser.email,
            },
            imageUrl,
          })
          .then(() => {
            navigate("/posts");
          });
      });
    });
  }

  return (
    <Container>
      <Header>發表文章</Header>
      <Form onSubmit={onSubmit}>
        <Image src={previewUrl} size="small" floated="left" />
        <Button basic as="label" htmlFor="post-image">
          上傳圖片
        </Button>
        <Form.Input
          type="file"
          id="post-image"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Form.Input
          placeholder="輸入文章標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Form.TextArea
          placeholder="輸入文章內容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Form.Dropdown
          placeholder="選擇文章主題"
          options={options}
          selection
          value={topicName}
          onChange={(e, { value }) => setTopicName(value)}
        />
        <Form.Button>送出</Form.Button>
      </Form>
    </Container>
  );
}
export default NewPost;
