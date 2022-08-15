import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { reset, getGroups } from "../features/groups/groupSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Group from "../components/Group";
import GroupForm from "../components/GroupForm";

function Groups() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const modal = useRef();

  const { user } = useSelector((state) => state.auth);
  const { groups, isLoading, isSuccess, isError, message } = useSelector(
    (store) => store.groups
  );
  console.log(groups);

  useEffect(() => {
    if (isError) {
      message !== "Cannot read properties of null (reading 'token')" &&
        toast.error(message);
    }

    if (!user) {
      navigate("/login");
    }

    dispatch(getGroups());

    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, isError, message, dispatch, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  const handleAdd = () => {
    modal.current.showModal();
  };

  const closeModal = () => {
    modal.current.close();
  };

  return (
    <>
      <div className="addGroup">
        <button title="Add group" onClick={handleAdd}>
          +
        </button>
      </div>
      <dialog ref={modal}>
        <GroupForm closeModal={closeModal} />
      </dialog>
      <div className="groups-container">
        {groups.length > 0 ? (
          groups.map((group) => (
            <Link key={group._id} to={`/groups/${group._id}`}>
              <Group
                name={group.name}
                members={group.members.length}
                wallet={group.wallet}
                currency={group.currency}
                role={
                  (user ? user._id : "") === group.createdBy
                    ? "admin"
                    : "member"
                }
              />
            </Link>
          ))
        ) : (
          <p className="not_found">You don't belong to any group</p>
        )}
      </div>
    </>
  );
}

export default Groups;
