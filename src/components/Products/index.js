import Header from "../Header";
import PrimeDealsSection from "../PrimeDealsSection";
import AllProductsSection from "../AllProductsSection";

function Products() {
  return (
    <>
      <Header />
      <div className="products-section">
        <PrimeDealsSection />
        <AllProductsSection />
      </div>
    </>
  );
}
export default Products;
