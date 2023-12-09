import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import ProductsCard from "../ProductsCard";
import "./index.css";

function PrimeDealsSection() {
  const [primeDeals, setPrimeDeals] = useState([]);
  const [status, setStatus] = useState("initial");

  const fetchPrimeDealsApi = async () => {
    setStatus("inProgress");
    try {
      const jwtToken = Cookies.get("jwt_token");
      const options = {
        method: "GET",
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch("https://apis.ccbp.in/prime-deals", options);
      const fetchedData = await response.json();
      if (response.ok) {
        const updatedFetchedData = fetchedData.prime_deals.map((each) => ({
          id: each.id,
          imageUrl: each.image_url,
          brand: each.brand,
          price: each.price,
          rating: each.rating,
          title: each.title,
        }));
        console.log(updatedFetchedData);
        setPrimeDeals(updatedFetchedData);
        setStatus("success");
      } else {
        setStatus("failure");
      }
    } catch (error) {
      console.log(error.message);
      setStatus("failure");
    }
  };

  useEffect(() => {
    fetchPrimeDealsApi();
  }, []);

  const succesView = () => (
    <div className="prime-deals-success-container">
      <h1 className="prime-deals-heading">Exclusive Prime Deals</h1>
      <div className="prime-deals">
        {primeDeals.map((each) => (
          <ProductsCard key={each.id} productData={each} />
        ))}
      </div>
    </div>
  );

  const LoadingView = () => (
    <div className="prime-deals-loader-contaner">
      <ThreeDots type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  );

  const FailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="register prime"
      className="register-prime-img"
    />
  );

  const renderPrimeDeals = () => {
    switch (status) {
      case "success":
        return succesView();
      case "failure":
        return FailureView();
      case "inProgress":
        return LoadingView();
      default:
        return null;
    }
  };
  return <div>{renderPrimeDeals()}</div>;
}
export default PrimeDealsSection;
