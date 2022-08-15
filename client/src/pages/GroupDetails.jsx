import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  reset,
  getOneGroup,
  deleteGroup,
  addMember,
  kickMember,
  leaveGroup,
} from "../features/groups/currentGroupSlice";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { FaInfoCircle, FaUserMinus, FaUserPlus } from "react-icons/fa";
import TransactionForm from "../components/TransactionForm";
import TransactionsList from "../components/TransactionsList";

function GroupDetails() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
  });
  const info = useRef();
  const modal = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { group, isLoading, isError, message, transactions } = useSelector(
    (state) => state.currentGroup
  );
  const { id } = useParams();


  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    if (isError) {
      message !== "Cannot read properties of null (reading 'token')" &&
        toast.error(message);
    }

    dispatch(getOneGroup(id));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, navigate, user, isError, message]);

  const handleDelete = () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this group? This action cannot be reversed"
    );
    if (confirm) {
      dispatch(deleteGroup(id));
      navigate("/groups");
    }
  };

  const handleLeave = () => {
    const confirm = window.confirm(
      "Are you sure you want to leave this group? You will have to contact the admin of the group to rejoin"
    );
    if (confirm) {
      dispatch(leaveGroup(id));
      navigate("/groups");
    }
  };

  const addUser = (e) => {
    e.preventDefault();
    dispatch(addMember({ groupId: id, formData }));
    setFormData({ username: "" });
  };

  const kick = (member) => {
    dispatch(kickMember({ groupId: id, data: { username: member } }));
  };

  const handleTransactionModal = () => {
    modal.current.showModal();
  };

  const closeModal = () => {
    modal.current.close();
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="group_details">
      <button onClick={() => setShow(!show)} className="info">
        <FaInfoCircle />
      </button>
      {Object.keys(group).length > 0 && (
        <>
          <h1>{group && group.name}</h1>
          <section>
            <div ref={info} className="group_info" data-show={show}>
              <span>
                Admin:{" "}
                {user && group.createdBy === user.username
                  ? "You"
                  : group.createdBy}
              </span>
              {user && user.username === group.createdBy && (
                <form className="add_user_form" onSubmit={addUser}>
                  <input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({
                        username: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="Enter username to add member"
                  />
                  <button type="submit">
                    <FaUserPlus />
                  </button>
                </form>
              )}
              <span className="members">
                Members:{" "}
                {group.members.map((member) => (
                  <span style={{ display: "flex" }} key={member}>
                    {member}&nbsp;&nbsp;
                    {user &&
                      user.username === group.createdBy &&
                      member !== user.username && (
                        <button
                          className="kick"
                          onClick={() => kick(member.toString())}
                        >
                          <FaUserMinus />
                        </button>
                      )}
                  </span>
                ))}
              </span>
              <span>
                Created at: {new Date(group.createdAt).toLocaleString("en-GB")}
              </span>
              {user && user.username === group.createdBy ? (
                <button className="delete_group" onClick={handleDelete}>
                  Delete group
                </button>
              ) : (
                <button className="delete_group" onClick={handleLeave}>
                  Leave group
                </button>
              )}
            </div>

            <div className="transactions_info">
              <div className="addGroup">
                <button
                  title="Add transaction"
                  onClick={handleTransactionModal}
                >
                  +
                </button>
              </div>
              <TransactionsList transactions={transactions} groupId={id} currency={group.currency}/>
            </div>
          </section>
          <dialog ref={modal}>
            <TransactionForm closeModal={closeModal} />
          </dialog>
        </>
      )}
    </div>
  );
}

export default GroupDetails;
