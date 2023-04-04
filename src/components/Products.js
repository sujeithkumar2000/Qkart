import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [isNoProductFound, setIsNoProductFound] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [cartLoad, setLoad] = useState(true);
  const [prod, setProd] = useState([]);
  let username = localStorage.getItem("username");
  const [cartData, setCartData] = useState([]);
  let token = localStorage.getItem("token");
  let debounceTimer;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    performAPICall();
  }, []);
  useEffect(() => {
    fetchCart(token);
  }, [cartLoad]);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      const productResponse = await axios.get(config.endpoint + "/products");
      setisLoading(false);
      setLoad(true);
      setProd(productResponse.data);
    } catch (err) {
      setisLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      let response = await axios.get(
        config.endpoint + "/products/search?value=" + text
      );
      setProd(response.data);
      setIsNoProductFound(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setIsNoProductFound(true);
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response = await axios.get(config.endpoint + "/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartData(response.data);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
      return null;
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(
      () => performSearch(event.target.value),
      debounceTimeout
    );
  };
  const isItemInCart = (items, productId) => {
    for(let i=0;i<items.length;i++){
      if(items[i].productId === productId){
        return true;
      }
    }
    return false;
  };
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log(productId+"pid");
    if (token) {
      if (isItemInCart(items, productId) && !options.preventDuplicate) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
      } else {
        try {
          const response = await axios.post(
            config.endpoint + "/cart",
            { "productId": productId, "qty": qty },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          setCartData(response.data);
        } catch (e) {
          enqueueSnackbar("Something went wrong", { variant: "error" });
          return null;
        }
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };
  return (
    <div>
      <Header
        children={
          <TextField
            className="search-desktop"
            size="small"
            onChange={(e) => {
              debounceSearch(e, 500);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
          />
        }
      />

      {/* Search view for mobiles */}

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(e) => {
          debounceSearch(e, 500);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item xs={12} md={username ? 9 : 12} className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {isNoProductFound ? (
            <>
              <Box className="loading">
                <SentimentDissatisfied />
                <p>No products found</p>
              </Box>
            </>
          ) : (
            <>
              {isLoading ? (
                <Box className="loading">
                  <CircularProgress />
                  <br />
                  Loading Products
                </Box>
              ) : (
                <>
                  <Grid container spacing={{ xs: 2, md: 3 }} padding={2}>
                    {prod.map((val, id) => {
                      return (
                        <Grid item xs={6} md={3} key={id}>
                          <ProductCard
                            product={val}
                            handleAddToCart={() =>
                              addToCart(token, cartData, prod, val._id, 1, {
                                preventDuplicate: false,
                              })
                            }
                          ></ProductCard>
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              )}
            </>
          )}
        </Grid>
        {username ? (
          <Grid item xs={12} md={3} sx={{ bgcolor: "#E9F5E1" }}>
            <Cart
              products={prod}
              items={generateCartItemsFrom(cartData, prod)}
              handleQuantity={addToCart}
            />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
