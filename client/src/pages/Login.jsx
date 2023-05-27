import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset, login } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

// login page
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/groups");
    }

    if (isError) {
      toast.error(message);
    }

    dispatch(reset());
  }, [dispatch, navigate, isSuccess, user, isError, message]);

  const { username, password } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login({ username, password }));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username or E-Mail</label>
          <input
            onChange={handleChange}
            value={username}
            type="text"
            placeholder="Username or email"
            name="username"
            id="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            value={password}
            type="password"
            placeholder="Password"
            name="password"
            id="password"
          />
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register now!</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
