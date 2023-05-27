function Group({ name, members, role, wallet, currency }) {
  return (
    <div className="group">
      <h3>{name}</h3>
      <div className="info">
        <span>Members: {members}</span>
        <span>Role: {role}</span>
        <span>
          {/* Convert number to currency format */}
          Wallet:{" "}
          {new Intl.NumberFormat(currency === "LBP" ? "de-DE" : "en-US", {
            style: "currency",
            currency,
          }).format(wallet)}
        </span>
      </div>
    </div>
  );
}

export default Group;
