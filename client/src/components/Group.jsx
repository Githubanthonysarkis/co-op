function Group({ name, members, role, wallet }) {
  return (
    <div className="group">
      <h3>{name}</h3>
      <div className="info">
        <span>Members: {members}</span>
        <span>Role: {role}</span>
        <span>
          Wallet:{" "}
          {new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "LBP",
          }).format(wallet)}
        </span>
      </div>
    </div>
  );
}

export default Group;
