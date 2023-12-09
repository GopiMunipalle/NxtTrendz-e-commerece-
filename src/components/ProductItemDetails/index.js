import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { BsPlusSquare, BsDashSquare } from "react-icons/bs";
import { ThreeDots } from "react-loader-spinner";
import Header from "../Header";
import SimilarProducts from "../SimilarProducts";
import CartContext from "../../context/CartContext";
import "./index.css";

const apiStatusConstant = {
  initital: "INITIAL",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
};
function ProductItemDetails() {
  const [productItemList, setProductItemList] = useState({});
  const [similarProductsList, setSimilarProductsList] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstant.initital);
  const [count, setCount] = useState(1);
  const { id } = useParams();

  const formattedData = (each) => ({
    availability: each.availability,
    brand: each.brand,
    description: each.description,
    imageUrl: each.image_url,
    price: each.price,
    rating: each.rating,
    style: each.style,
    totalReviews: each.total_reviews,
    title: each.title,
    id: each.id,
  });
  const fetchProductItemListApi = async () => {
    try {
      const jwtToken = Cookies.get("jwt_token");
      setApiStatus(apiStatusConstant.inProgress);
      const url = `https://apis.ccbp.in/products/${id}`;
      const options = {
        method: "GET",
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch(url, options);
      if (response.ok) {
        const fetchedData = await response.json();
        const fetchedProductItems = formattedData(fetchedData);
        const fetchedSimilarItems = fetchedData.similar_products.map(
          (each) => ({
            id: each.id,
            availability: each.availability,
            brand: each.brand,
            description: each.description,
            imageurl: each.image_url,
            price: each.price,
            rating: each.rating,
            style: each.style,
            totalReviews: each.total_reviews,
            title: each.title,
          })
        );
        setProductItemList(fetchedProductItems);
        setSimilarProductsList(fetchedSimilarItems);
        setApiStatus(apiStatusConstant.success);
      } else {
        setApiStatus(apiStatusConstant.failure);
      }
    } catch (error) {
      console.log(error.message);
      setApiStatus(apiStatusConstant.failure);
    }
  };

  useEffect(() => {
    fetchProductItemListApi();
  }, [id]);

  const onClickQuantityIncrease = () => {
    setCount(count + 1);
  };

  const onClickQuantityDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const productItemDetailsSuccesView = () => (
    <CartContext.Consumer>
      {(value) => {
        const { addCartItem } = value;
        const {
          id,
          title,
          imageUrl,
          price,
          rating,
          availability,
          brand,
          totalReviews,
          description,
        } = productItemList;

        const onClickAddToCart = () => {
          addCartItem({ ...productItemList, count });
        };
        return (
          <div className="product-item-bg-container">
            <div className="product-item-deatails">
              <img src={imageUrl} alt={title} className="product-item-image" />
              <div className="product-items">
                <h1 className="product-items-title">{title}</h1>
                <p className="product-items-price">Rs{price}/-</p>
                <div className="rating-reviews-card">
                  <div className="rating-card">
                    <p className="product-items-rating">{rating}</p>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                      className="star"
                    />
                  </div>
                  <p className="product-items-reviews">{totalReviews}Reviews</p>
                </div>
                <p className="product-items-description">{description}</p>
                <div className="product-items-availability-card">
                  <p className="product-items-availability">Available: </p>
                  <p className="span-items">{availability}</p>
                </div>
                <div className="product-items-availability-card">
                  <p className="product-items-availability">Brand : </p>
                  <p className="span-items">{brand}</p>
                </div>
                <hr />
                <div className="button-card">
                  <button
                    type="button"
                    className="quantity-button"
                    onClick={onClickQuantityDecrease}
                  >
                    <BsDashSquare className="square-button" />
                  </button>
                  <p className="count-text">{count}</p>
                  <button
                    type="button"
                    className="quantity-button"
                    onClick={onClickQuantityIncrease}
                  >
                    <BsPlusSquare className="square-button" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onClickAddToCart}
                  className="add-to-cart-button"
                >
                  Add To Cart
                </button>
              </div>
            </div>
            <h1 className="similar-items-title">Similar Products</h1>
            <ul className="similar-products-ul-container">
              {similarProductsList.map((each) => (
                <SimilarProducts key={each.id} productDetails={each} />
              ))}
            </ul>
          </div>
        );
      }}
    </CartContext.Consumer>
  );

  const productItemDetailsLoadingView = () => (
    <div className="prime-deals-loader-contaner">
      <ThreeDots type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  );

  const productItemDetailsFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  );

  const productItemDetails = () => {
    switch (apiStatus) {
      case apiStatusConstant.success:
        return productItemDetailsSuccesView();
      case apiStatusConstant.failure:
        return productItemDetailsFailureView();
      case apiStatusConstant.inProgress:
        return productItemDetailsLoadingView();
      default:
        return null;
    }
  };
  return (
    <div className="product-item-details-container">
      <Header />
      {productItemDetails()}
    </div>
  );
}
export default ProductItemDetails;
