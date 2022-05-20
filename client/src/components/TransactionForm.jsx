import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "../features/groups/currentGroupSlice";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";

function TransactionForm({ closeModal }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
  });

  const { id } = useParams();

  const { isLoading } = useSelector((state) => state.currentGroup);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(addTransaction({ groupId: id, transactionData: formData }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <form className="create_group" onSubmit={handleSubmit}>
      <h2>Add transaction</h2>
      <div className="form-group">
        <label htmlFor="name">Transaction's Name</label>
        <input
          autoFocus
          type="text"
          name="name"
          id="name"
          placeholder="Transaction's name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Transaction's Amount</label>
        <input
          autoFocus
          type="number"
          placeholder="Positive for incomes, Negative for outcomes"
          name="amount"
          id="amount"
          value={formData.amount}
          onChange={handleChange}
        />
      </div>
      <div className="button_container">
        <button type="submit">Add</button>
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

export default TransactionForm;
