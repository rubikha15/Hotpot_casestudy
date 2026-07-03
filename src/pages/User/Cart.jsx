import { useEffect, useState } from "react";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import API from "../../api/api";
import { useUser } from "../../context/UserContext";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

function Cart() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const [checkout, setCheckout] = useState({
    shippingAddress: "",
    paymentMethod: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    bank: "",
  });

  const normalizeCartData = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.cartItems)) return data.cartItems;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.cartItemsDto)) return data.cartItemsDto;
    return [];
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/Cart/${user.id}`);
      setCartItems(normalizeCartData(res.data));
    } catch (err) {
      console.log(err);
      setCartItems([]);
      alert("Unable to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadCart();
  }, [user]);

  const updateQty = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    await API.put(`/Cart/${cartItemId}`, { quantity: Number(newQty) });
    loadCart();
  };

  const removeItem = async (cartItemId) => {
    await API.delete(`/Cart/${cartItemId}`);
    loadCart();
  };

  const clearCart = async () => {
    await API.delete(`/Cart/clear/${user.id}`);
    loadCart();
  };

  const placeOrder = async () => {
    if (safeCartItems.length === 0) return alert("Cart is empty");
    if (!checkout.shippingAddress.trim()) return alert("Enter shipping address");
    if (!checkout.paymentMethod) return alert("Select payment method");

    if (checkout.paymentMethod === "Card") {
      if (!checkout.cardNumber || !checkout.cardName || !checkout.expiry || !checkout.cvv) {
        return alert("Enter card details");
      }
    }

    if (checkout.paymentMethod === "Net Banking" && !checkout.bank) {
      return alert("Select bank");
    }

    try {
      await API.post("/Order/place-order", {
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
      });

      alert("Order placed successfully");
      setCheckout({
        shippingAddress: "",
        paymentMethod: "",
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
        bank: "",
      });
      loadCart();
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data || "Unable to place order");
    }
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const itemTotal = safeCartItems.reduce((sum, item) => {
    const price = Number(item.price || item.menuPrice || item.discountPrice || item.menuItem?.price || 0);
    const quantity = Number(item.quantity || 0);
    return sum + price * quantity;
  }, 0);

  const deliveryFee = itemTotal > 0 ? 40 : 0;
  const grandTotal = itemTotal + deliveryFee;

  if (loading) return <Loader />;

  return (
    <main className="page">
      <div className="cart-banner">
        <div>
          <p className="tagline">Checkout</p>
          <h1>Your Food Cart</h1>
          <p>Review your items, update quantity and place your order.</p>
        </div>
        <ShoppingBag size={70} />
      </div>

      {safeCartItems.length === 0 ? (
        <EmptyState title="Your cart is empty" text="Add some delicious food from the menu page." />
      ) : (
        <div className="cart-layout">
          <section className="cart-list">
            <div className="cart-title-row">
              <h2>Cart Items</h2>
              <button className="danger-btn" onClick={clearCart}>Clear Cart</button>
            </div>

            {safeCartItems.map((item) => {
              const cartItemId = item.cartItemId || item.id;
              const itemName = item.itemName || item.menuItemName || item.menuItem?.itemName || "Menu Item";
              const price = Number(item.price || item.menuPrice || item.discountPrice || item.menuItem?.price || 0);
              const quantity = Number(item.quantity || 0);

              return (
                <div className="cart-item" key={cartItemId}>
                  <div className="cart-food">
                    <div className="cart-food-img">🍽️</div>
                    <div>
                      <h3>{itemName}</h3>
                      <p>₹{price} per item</p>
                    </div>
                  </div>

                  <div className="qty-box">
                    <button onClick={() => updateQty(cartItemId, quantity - 1)}>
                      <Minus size={15} />
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQty(cartItemId, quantity + 1)}>
                      <Plus size={15} />
                    </button>
                  </div>

                  <strong>₹{price * quantity}</strong>

                  <button className="icon-danger" onClick={() => removeItem(cartItemId)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </section>

          <aside className="checkout-card">
            <h2>Order Summary</h2>

            <div className="bill-row">
              <span>Item Total</span>
              <strong>₹{itemTotal}</strong>
            </div>

            <div className="bill-row">
              <span>Delivery Fee</span>
              <strong>₹{deliveryFee}</strong>
            </div>

            <div className="bill-total">
              <span>Grand Total</span>
              <strong>₹{grandTotal}</strong>
            </div>

            <textarea
              placeholder="Enter shipping address"
              value={checkout.shippingAddress}
              onChange={(e) => setCheckout({ ...checkout, shippingAddress: e.target.value })}
            />

            <select
              value={checkout.paymentMethod}
              onChange={(e) => setCheckout({ ...checkout, paymentMethod: e.target.value })}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash On Delivery">Cash On Delivery</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>

            {checkout.paymentMethod === "UPI" && (
              <div className="payment-box">
                <h3>Scan QR to Pay</h3>
                <div className="qr-box">₹</div>
                <p>UPI ID: hotbyte@upi</p>
              </div>
            )}

            {checkout.paymentMethod === "Card" && (
              <div className="payment-box">
                <input
                  placeholder="Card Number"
                  maxLength="16"
                  value={checkout.cardNumber}
                  onChange={(e) => setCheckout({ ...checkout, cardNumber: e.target.value })}
                />
                <input
                  placeholder="Card Holder Name"
                  value={checkout.cardName}
                  onChange={(e) => setCheckout({ ...checkout, cardName: e.target.value })}
                />
                <div className="form-grid">
                  <input
                    placeholder="MM/YY"
                    value={checkout.expiry}
                    onChange={(e) => setCheckout({ ...checkout, expiry: e.target.value })}
                  />
                  <input
                    placeholder="CVV"
                    maxLength="3"
                    value={checkout.cvv}
                    onChange={(e) => setCheckout({ ...checkout, cvv: e.target.value })}
                  />
                </div>
              </div>
            )}

            {checkout.paymentMethod === "Net Banking" && (
              <div className="payment-box">
                <select
                  value={checkout.bank}
                  onChange={(e) => setCheckout({ ...checkout, bank: e.target.value })}
                >
                  <option value="">Select Bank</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="SBI">SBI</option>
                  <option value="Axis Bank">Axis Bank</option>
                </select>
              </div>
            )}

            {checkout.paymentMethod === "Cash On Delivery" && (
              <div className="payment-box">
                <p>Pay cash when your order is delivered.</p>
              </div>
            )}

            <button className="primary-btn full" onClick={placeOrder}>
              Place Order
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;