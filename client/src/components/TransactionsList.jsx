import { useRef, useState } from "react";
import TransactionDetails from "./TransactionDetails";

function TransactionsList({ transactions }) {
  const [transaction, setTransaction] = useState({});
  const modal = useRef();
  const handleClick = (transaction) => {
    setTransaction(transaction);
    modal.current.showModal();
  };

  const closeModal = () => {
    modal.current.close();
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
              <span>
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "LBP",
                }).format(transaction.amount)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="not_found">Transactions will be shown here</p>
      )}
      <dialog ref={modal}>
        <TransactionDetails transaction={transaction} closeModal={closeModal} />
      </dialog>
    </>
  );
}

export default TransactionsList;
