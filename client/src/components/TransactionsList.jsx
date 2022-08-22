import { useRef, useState } from "react";
import TransactionDetails from "./TransactionDetails";

function TransactionsList({ transactions, currency }) {
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
                {new Intl.NumberFormat(currency === "LBP" ? "de-DE" : "en-US", {
                  style: "currency",
                  currency,
                }).format(transaction.amount)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="not_found center">Transactions will be shown here</p>
      )}
      <dialog ref={modal}>
        <TransactionDetails
          transaction={transaction}
          closeModal={closeModal}
          currency={currency}
        />
      </dialog>
    </>
  );
}

export default TransactionsList;
