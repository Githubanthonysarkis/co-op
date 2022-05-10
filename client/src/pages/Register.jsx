import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset, register } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
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

  const { username, email, password, password2 } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      dispatch(register({ username, email, password }));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="form-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            onChange={handleChange}
            value={username}
            type="text"
            placeholder="Username"
            name="username"
            id="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-Mail address</label>
          <input
            onChange={handleChange}
            value={email}
            type="text"
            placeholder="name@example.com"
            name="email"
            id="email"
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
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            onChange={handleChange}
            value={password2}
            type="password"
            placeholder="Confirm Password"
            name="password2"
            id="password2"
          />
        </div>
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login now!</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
