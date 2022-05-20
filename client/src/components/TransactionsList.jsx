import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "./Spinner";
import { getTransaction } from "../features/groups/currentGroupSlice";

function TransactionsList({ groupId, transactions }) {
  const dispatch = useDispatch();
  const { transaction, isLoading, isSuccess } = useSelector(
    (state) => state.currentGroup
  );
  const modal = useRef();

  const handleClick = (id) => {
    dispatch(getTransaction({ groupId, transactionId: id }));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
            <li
              onClick={() => handleClick(transaction._id)}
              title="Click for details"
              key={transaction._id}
            >
              <span>{transaction.name}</span>
              <span>{transaction.amount}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Transactions will be shown here</p>
      )}
      <dialog ref={modal}>{transaction.name}</dialog>
    </>
  );
}

export default TransactionsList;
