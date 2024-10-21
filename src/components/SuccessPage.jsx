import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SuccessPage = () => {
  const [transactionInfo, setTransactionInfo] = useState(null);
  const location = useLocation();
  const price = new URLSearchParams(location.search).get("price");

  useEffect(() => {
    const fetchTransactionInfo = async () => {
      try {
        const response = await fetch("http://localhost:8000/success.php");
        const data = await response.json();
        setTransactionInfo(data);
      } catch (error) {
        console.error("Error fetching transaction info:", error);
      }
    };

    fetchTransactionInfo();
  }, []);

  return (
    <div className="mt-[5rem]">
      <h1>Transaction Successful</h1>
      <p>Price: {price}</p>
      {transactionInfo && (
        <div>
          <p>Transaction ID: {transactionInfo.tran_id}</p>
          <p>Transaction Date: {transactionInfo.tran_date}</p>
          {/* Add more transaction details as needed */}
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
