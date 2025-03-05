import { Menu, Search, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import firebase from "./utils/firebase";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = useCallback(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate("/signin");
      });
  }, [navigate]);

  return (
    <Menu stackable inverted style={{ backgroundColor: "#84C1FF",borderBottom: "4px solid #2185d0" }}>
      <Menu.Item as={Link} to="/posts" header>
        <Icon name="home" size="large" /> SideProject
      </Menu.Item>
      <Menu.Item>
        <Search placeholder="搜尋文章..." />
      </Menu.Item>
      <Menu.Menu position="right">
        {user ? (
          <>
            <Menu.Item as={Link} to="/new-post">
              <Icon name="edit" /> 發表文章
            </Menu.Item>
            <Menu.Item as={Link} to="/my/posts">
              <Icon name="user circle" /> 會員
            </Menu.Item>
            <Menu.Item onClick={handleLogout}>
              <Icon name="sign-out" /> 登出
            </Menu.Item>
          </>
        ) : (
          <Menu.Item as={Link} to="/signin">
            <Icon name="sign-in" /> 註冊 / 登入
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
