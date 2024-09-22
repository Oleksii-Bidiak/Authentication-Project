import { FC, useState } from "react";
import AuthService from "../services/AuthService";
import { IUser } from "../models/IUser";

interface Props {
  isAuth: boolean;
  setIsAuth: (val: boolean) => void;
  setUser: (user: IUser) => void;
}

export const LoginForm: FC<Props> = ({ isAuth, setIsAuth, setUser }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = async () => {
    try {
      const response = await AuthService.login(email, password);

      localStorage.setItem("token", response.data.accessToken);
      setIsAuth(true);
      setUser(response.data.user);
    } catch (e) {
      console.log(e);
    }
  };

  const registration = async () => {
    try {
      const response = await AuthService.registration(email, password);

      localStorage.setItem("token", response.data.accessToken);
      setIsAuth(true);
      setUser(response.data.user);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
      />

      <button onClick={() => login()}>Логін</button>
      <button onClick={() => registration()}>Реєстрація</button>
    </div>
  );
};
