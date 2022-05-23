import { useRef, useState } from "react";

function TransactionsList({ groupId, transactions }) {
  const [transaction, setTransaction] = useState({});
  const modal = useRef();

  const handleClick = (transaction) => {
    setTransaction(transaction);
    modal.current.showModal();
  };

  return (
    <>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
            <li
              onClick={() => handleClick(transaction)}
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
      <dialog ref={modal}>
        {transaction.name} - {transaction.postedBy}
      </dialog>
    </>
  );
}

export default TransactionsList;
