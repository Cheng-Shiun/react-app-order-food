import { useContext } from "react";
import { CartContext } from "../store/CartContext";
import { UserProgressContext } from "../store/UserProgressContext";
import { currentFormatter } from "../util/currentFormatter";
import CartItem from "./CartItem";
import Button from "./UI/Button";
import Modal from "./UI/Modal";

export default function Cart() {
  const cartCxt = useContext(CartContext);
  const userProgressCxt = useContext(UserProgressContext);

  const cartTotal = cartCxt.items.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity;
  }, 0);

  function handleCloseCart() {
    userProgressCxt.hideCart();
  }

  function handleGoToCheckout() {
    userProgressCxt.showCheckout();
  }

  return (
    <Modal className="cart" open={userProgressCxt.progress === "cart"} onClose={userProgressCxt.progress === "cart" ? handleCloseCart : null}>
      <h2>購物車清單</h2>
      <ul>
        {cartCxt.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onIncrease={() => cartCxt.addItem(item)}
            onDecrease={() => cartCxt.removeItem(item.id)}
          />
        ))}
      </ul>
      <p className="cart-total">
        <span className="cart-total-title">結帳金額</span>
        <span className="cart-total-amount">NT{currentFormatter.format(cartTotal)}</span>
      </p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          關閉
        </Button>
        <Button disabled={cartCxt.items.length === 0} onClick={handleGoToCheckout}>
          結帳
        </Button>
      </p>
    </Modal>
  );
}
