import { createContext, useReducer } from "react";

export const CartContext = createContext({
  items: [],
  addItem: (newItem) => {},
  removeItem: (itemId) => {},
  resetCart: () => {},
});

function cartReducer(state, action) {
  if (action.identifier === "ADD_ITEM") {
    const updatedItems = [...state.items]; // 複製狀態中的商品
    const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === action.payload.id);

    if (existingCartItemIndex > -1) {
      const existingCartItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };

      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({
        ...action.payload,
        quantity: 1,
      });
    }
    return { ...state, items: updatedItems };
  }

  if (action.identifier === "REMOVE_ITEM") {
    const updatedItems = [...state.items];
    const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === action.payload);

    const existingCartItem = updatedItems[existingCartItemIndex];
    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = { ...existingCartItem, quantity: existingCartItem.quantity - 1 };
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return { ...state, items: updatedItems };
  }

  if (action.identifier === "CLEAR_ITEM") {
    return { ...state, items: [] };
  }

  return state;
}

export default function CartContextProvider({ children }) {
  const [cartState, cartStateDispatch] = useReducer(cartReducer, { items: [] });

  function handleAddItemToCart(item) {
    cartStateDispatch({
      identifier: "ADD_ITEM",
      payload: item,
    });
  }

  function handleRemoveItemFromCart(id) {
    cartStateDispatch({
      identifier: "REMOVE_ITEM",
      payload: id,
    });
  }

  function handleClearAllCartItems() {
    cartStateDispatch({
      identifier: "CLEAR_ITEM",
    });
  }

  const cartContext = {
    items: cartState.items,
    addItem: handleAddItemToCart,
    removeItem: handleRemoveItemFromCart,
    resetCart: handleClearAllCartItems,
  };

  // console.log(cartState);

  return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>;
}
