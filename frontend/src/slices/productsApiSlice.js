import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice"; //use this because it uses endpoints that are dealing with async requests

//replaces a fetch or axios request
export const productsApiSlice = apiSlice.injectEndpoints({
  //A function to inject the endpoints into the original API, but also give you that same API with correct types for these endpoints back. Useful with code-splitting.
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      keepUnusedDataFor: 5, //value in seconds
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } =
  productsApiSlice;
