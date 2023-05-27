import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// if user navigates to "/", redirect to "/groups"
function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/groups");
  }, [navigate]);

  return <div></div>;
}

export default HomePage;
