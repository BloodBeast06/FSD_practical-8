import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import axios from "axios";

const ProductContext = createContext(null);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
});

function productReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        categories: action.payload.categories,
      };
    case "FETCH_PRODUCT_SUCCESS":
      return { ...state, loading: false, selectedProduct: action.payload };
    case "SET_CATEGORY":
      return { ...state, activeCategory: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const initialState = {
  products: [],
  selectedProduct: null,
  categories: [],
  activeCategory: "all",
  searchQuery: "",
  loading: false,
  error: null,
};

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = useCallback(async () => {
    dispatch({ type: "FETCH_START" });

    try {
      const { data } = await api.get("/products");
      const categories = [...new Set(data.map((product) => product.category))];

      dispatch({
        type: "FETCH_PRODUCTS_SUCCESS",
        payload: { products: data, categories },
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to fetch products";
      dispatch({ type: "FETCH_ERROR", payload: message });
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    dispatch({ type: "FETCH_START" });

    try {
      const { data } = await api.get(`/products/${id}`);
      dispatch({ type: "FETCH_PRODUCT_SUCCESS", payload: data });
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to fetch product";
      dispatch({ type: "FETCH_ERROR", payload: message });
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = useCallback(
    async (productData) => {
      const { data } = await api.post("/products", productData);
      await fetchProducts();
      return data;
    },
    [fetchProducts]
  );

  const value = useMemo(() => {
    const categoryProducts =
      state.activeCategory === "all"
        ? state.products
        : state.products.filter(
            (product) => product.category === state.activeCategory
          );

    const filteredProducts = categoryProducts.filter((product) =>
      product.title.toLowerCase().includes(state.searchQuery.toLowerCase())
    );

    return {
      ...state,
      filteredProducts,
      setCategory(category) {
        dispatch({ type: "SET_CATEGORY", payload: category });
      },
      setSearch(searchQuery) {
        dispatch({ type: "SET_SEARCH", payload: searchQuery });
      },
      fetchProductById,
      createProduct,
      refreshProducts: fetchProducts,
    };
  }, [createProduct, fetchProductById, fetchProducts, state]);

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }

  return context;
}

export { api };
