import { Link } from "react-router-dom";
import { FaUser, FaSignInAlt, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <section className="header">
      <div className="logo">
        <Link to="/">
          <h2>CO-OP</h2>
        </Link>
      </div>
      <nav>
        <ul>
          {user ? (
            <>
              <li>
                <Link to="/groups">
                  <FaUsers /> My Groups
                </Link>
              </li>
              <li>
                <button onClick={() => dispatch(logout())}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register">
                  <FaUser /> Register
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <FaSignInAlt /> Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </section>
  );
}

export default Header;
