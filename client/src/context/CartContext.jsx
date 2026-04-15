import { createContext, useContext, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item._id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

const initialState = {
  items: [],
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(() => {
    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      items: state.items,
      totalItems,
      totalPrice,
      addItem(product, quantity = 1) {
        dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
      },
      removeItem(id) {
        dispatch({ type: "REMOVE_ITEM", payload: id });
      },
      updateQuantity(id, quantity) {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
      },
      clearCart() {
        dispatch({ type: "CLEAR_CART" });
      },
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
