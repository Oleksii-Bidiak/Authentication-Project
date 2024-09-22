import { useCallback, useEffect, useState } from "react";
import { LoginForm } from "./conponents/LoginForm";
import { IUser } from "./models/IUser";
import axios from "axios";
import { AuthResponse } from "./models/AuthResponse";
import { API_URL } from "./http";
import AuthService from "./services/AuthService";
import UserService from "./services/userService";

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({} as IUser);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSetAuthHandler = useCallback((val: boolean) => {
    setIsAuth(val);
  }, []);

  const setUserHandler = useCallback((user: IUser) => {
    setUser(user);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.accessToken);
      setIsAuth(true);
      setUser(response.data.user);
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      localStorage.removeItem("token");
      setIsAuth(false);
      setUser({} as IUser);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      checkAuth().then(() => setIsLoading(false));
    }
  }, []);

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (!isAuth) {
    return (
      <LoginForm
        isAuth={isAuth}
        setIsAuth={isSetAuthHandler}
        setUser={setUserHandler}
      />
    );
  }

  return (
    <div className="App">
      <h1>
        {isAuth ? `Користувача ${user.email} авторизовано` : "АВТОРИЗУЙТЕСЬ"}
      </h1>
      <h1>{user.isActivated ? "Аккаунт активовано" : "АКТИВУЙТЕ АККАУНТ"}</h1>
      <button onClick={() => logout()}>Вийти</button>
      <br />
      <button onClick={fetchUsers}>Отримати користувачів</button>
      {users.map((user) => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}

export default App;
