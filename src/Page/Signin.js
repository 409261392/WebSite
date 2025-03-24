import React from "react";
import {
  Form,
  Container,
  Message,
  Button,
  Card,
  Header,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import firebase from "../utils/firebase";

function Signin() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = React.useState("register");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  function onSubmit() {
    setLoading(true);
    if (activeItem === "register") {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          navigate("/posts");
          setLoading(false);
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              setErrorMessage("信箱已存在");
              break;
            case "auth/invalid-email":
              setErrorMessage("信箱格式不正確");
              break;
            case "auth/weak-password":
              setErrorMessage("密碼強度不足");
              break;
            default:
              setErrorMessage("註冊失敗，請稍後再試");
          }
          setLoading(false);
        });
    } else if (activeItem === "signin") {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          navigate("/posts");
          setLoading(false);
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              setErrorMessage("信箱格式不正確");
              break;
            case "auth/wrong-password":
              setErrorMessage("密碼錯誤");
              break;
            case "auth/user-not-found":
              setErrorMessage("找不到該使用者");
              break;
            default:
              setErrorMessage("登入失敗，請稍後再試");
          }
          setLoading(false);
        });
    }
  }

  return (
    <Container 
        className="signin-container" 
        style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{
          width: "400px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Header as="h2" textAlign="center">
          {activeItem === "register" ? "註冊帳號" : "登入"}
        </Header>
        <Form onSubmit={onSubmit}>
          <Form.Input
            label="信箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="請輸入信箱"
            fluid
          />
          <Form.Input
            label="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入密碼"
            type="password"
            fluid
          />
          {errorMessage && <Message negative>{errorMessage}</Message>}
          <Button primary fluid loading={isLoading}>
            {activeItem === "register" ? "註冊" : "登入"}
          </Button>
        </Form>
        <Message>
          {activeItem === "register" ? "已經有帳號？" : "還沒有帳號？"}
          <Button
            basic
            color="blue"
            size="small"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              setErrorMessage("");
              setActiveItem(activeItem === "register" ? "signin" : "register");
            }}
          >
            {activeItem === "register" ? "登入" : "註冊"}
          </Button>
        </Message>
      </Card>
    </Container>
  );
}

export default Signin;
