import { useContext } from "react";
import logoImg from "../assets/logo.jpg";
import { CartContext } from "../store/CartContext";
import { UserProgressContext } from "../store/UserProgressContext";
import Button from "./UI/Button";

export default function Header() {
  const cartCxt = useContext(CartContext);
  const userProgressCxt = useContext(UserProgressContext);

  const totalCartItems = cartCxt.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  function handleOpenCart() {
    userProgressCxt.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="logo" />
        <h1>李艾克速食吧</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleOpenCart}>
          購物車 ({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
