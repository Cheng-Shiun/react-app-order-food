import { useActionState, useContext } from "react";
import useFetch from "../hooks/useFetch";
import { CartContext } from "../store/CartContext";
import { UserProgressContext } from "../store/UserProgressContext";
import { currentFormatter } from "../util/currentFormatter";
import Button from "./UI/Button";
import Error from "./UI/Error";
import Input from "./UI/Input";
import Modal from "./UI/Modal";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCxt = useContext(CartContext);
  const userProgressCxt = useContext(UserProgressContext);

  const { responseData, error, sendRequest, clearResponseData } = useFetch("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCxt.items.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity;
  }, 0);

  function handleCloseCheckout() {
    userProgressCxt.hideCheckout();
  }

  async function checkoutAction(prevState, formData) {
    // event.preventDefault();

    // const fd = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());

    await sendRequest(
      JSON.stringify({
        order: {
          items: cartCxt.items,
          customer: customerData,
        },
      }),
    );
    // fetch("http://localhost:3000/orders", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     order: {
    //       items: cartCxt.items,
    //       customer: customerData,
    //     },
    //   }),
    // });
  }

  const [formState, formAction, isSending] = useActionState(checkoutAction, null);

  function handleReset() {
    userProgressCxt.hideCheckout();
    cartCxt.resetCart(); // 清空購物車
    clearResponseData(); // 重置請求的狀態
  }

  let actions = (
    <>
      <Button textOnly type="button" onClick={handleCloseCheckout}>
        關閉
      </Button>
      <Button>確認付款</Button>
    </>
  );

  if (isSending) {
    actions = <span>付款資料送出中...</span>;
  }

  // 請求成功 -> 表示付款成功
  if (responseData && !error) {
    return (
      <Modal open={userProgressCxt.progress === "checkout"} onClose={handleReset}>
        <h2>付款成功</h2>
        <p>我們已收到您的訂單</p>
        <p>稍後會將訂單明細發送至您所填的電子信箱，敬請查收確認，謝謝!</p>
        <p className="modal-actions">
          <Button onClick={handleReset}>OK</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={userProgressCxt.progress === "checkout"} onClose={handleCloseCheckout}>
      <form action={formAction}>
        <h2>結帳付款</h2>
        <p className="cart-total left">
          <span className="cart-total-title">結帳金額</span>
          <span className="cart-total-amount">NT{currentFormatter.format(cartTotal)}</span>
        </p>
        <Input type="text" label="姓名" id="name" required />
        <Input type="email" label="電子信箱" id="email" required />

        <div className="control-row">
          <Input type="text" label="郵遞區號" id="postal-code" required />
          <Input type="text" label="所在縣市" id="city" required />
          <Input type="text" label="地址" id="address" required />
        </div>
        {error && <Error title="發生錯誤，付款失敗..." message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
