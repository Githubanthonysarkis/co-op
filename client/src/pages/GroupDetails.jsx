import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  reset,
  getOneGroup,
  deleteGroup,
} from "../features/groups/currentGroupSlice";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { FaInfoCircle } from "react-icons/fa";
import TransactionForm from "../components/TransactionForm";
import TransactionsList from "../components/TransactionsList";

function GroupDetails() {
  const [show, setShow] = useState(false);
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
              <span className="members">
                Members:{" "}
                {group.members.map((member) => (
                  <span key={member}>{member}</span>
                ))}
              </span>
              <span>
                Created at: {new Date(group.createdAt).toLocaleString("en-GB")}
              </span>
              {user && user.username === group.createdBy && (
                <button className="delete_group" onClick={handleDelete}>
                  Delete group
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
              <TransactionsList transactions={transactions} groupId={id} />
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
