import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createGroup } from "../features/groups/groupSlice";
import Spinner from "./Spinner";

function GroupForm({ closeModal }) {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("LBP");

  const { isLoading } = useSelector((state) => state.groups);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createGroup({ name: name.trim(), currency }));
  };

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <form className="create_group" onSubmit={handleSubmit}>
      <h2>Create group</h2>
      <div className="form-group">
        <label htmlFor="name">Group's Name</label>
        <input
          autoFocus
          placeholder="You will be the only admin of this group"
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group inline">
        <label htmlFor="currency">Currency type</label>
        <select defaultValue="LBP" onChange={(e) => {setCurrency(e.target.value); console.log(currency)}}>
          <option value="LBP">LBP</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <div className="button_container">
        <button type="submit">Create</button>
        <button
          type="button"
          className="cancel_button"
          onClick={() => closeModal()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default GroupForm;
