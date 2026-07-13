import { useContext } from "react";
import { CartContext } from "../store/CartContext";
import { currentFormatter } from "../util/currentFormatter";
import Button from "./UI/Button";

export default function MealItem({ meal }) {
  const cartCxt = useContext(CartContext);

  function handleAddMealToCart() {
    cartCxt.addItem(meal);
  }

  return (
    <li className="meal-item">
      <article>
        <img src={`http://localhost:3000/${meal.image}`} alt="" />
        <div>
          <h3>{meal.name}</h3>
          <p className="meal-item-price">NT{currentFormatter.format(meal.price)}</p>
          <p className="meal-item-description">{meal.description}</p>
        </div>
        <p className="meal-item-actions">
          <Button onClick={handleAddMealToCart}>加入購物車</Button>
        </p>
      </article>
    </li>
  );
}
