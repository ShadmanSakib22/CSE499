import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = ({ setIsPaid }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const validatePayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const val_id = urlParams.get("val_id");

      try {
        const response = await fetch("http://localhost:8000/php/success.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `val_id=${val_id}`,
        });

        const data = await response.json();

        if (data.status === "VALID" || data.status === "VALIDATED") {
          setIsPaid(true);
          navigate("/ticket");
        } else {
          console.error("Payment validation failed");
          navigate("/ticket");
        }
      } catch (error) {
        console.error("Error validating payment:", error);
        navigate("/ticket");
      }
    };

    validatePayment();
  }, [setIsPaid, navigate]);

  return <div>Processing payment...</div>;
};

export default PaymentSuccess;
