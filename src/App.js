import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductItemDetails from "./components/ProductItemDetails";
import NotFound from "./components/NotFound";
import CartContext from "./context/CartContext";
import "./App.css";

function App() {
  const [cartList, setCartList] = useState([]);

  const removeAllCartItems = () => {
    setCartList([]);
  };

  const addCartItem = (product) => {
    const productData = cartList.find((eachItem) => eachItem.id === product.id);

    if (productData) {
      setCartList((prevState) =>
        prevState.map((eachItem) => {
          if (productData.id === eachItem.id) {
            const updatedCount = eachItem.count + product.count;
            return { ...eachItem, count: updatedCount };
          }
          return eachItem;
        })
      );
    } else {
      setCartList((prevState) => [...prevState, product]);
    }
  };

  const incrementCartItemQuantity = (id) => {
    setCartList((prevState) =>
      prevState.map((eachItem) => {
        if (eachItem.id === id) {
          const updatedCount = eachItem.count + 1;
          return { ...eachItem, count: updatedCount };
        }
        return eachItem;
      })
    );
  };
  const decrementCartItemQuantity = (id) => {
    const productObject = cartList.find((eachItem) => eachItem.id === id);
    if (productObject.count > 1) {
      setCartList((prevState) =>
        prevState.map((eachItem) => {
          if (eachItem.id === id) {
            const updatedCount = eachItem.count - 1;
            return { ...eachItem, count: updatedCount };
          }
          return eachItem;
        })
      );
    } else {
      removeCartItem(id);
    }
  };
  const removeCartItem = (id) => {
    const updatedCartItem = cartList.filter((each) => each.id !== id);
    setCartList(updatedCartItem);
  };

  const contextValue = {
    cartList,
    addCartItem,
    removeCartItem,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
    removeAllCartItems,
  };

  return (
    <BrowserRouter>
      <CartContext.Provider value={contextValue}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products/:id" element={<ProductItemDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartContext.Provider>
    </BrowserRouter>
  );
}

export default App;
