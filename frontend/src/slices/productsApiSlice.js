import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
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
      providesTags: ["Products"],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: "POST",
      }),
      invalidatesTags: ["Product"], //Used by mutation endpoints. Determines which cached data should be either re-fetched or removed from the cache. Stops us from having to reload the page everytime
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"], //Hey, after this mutation runs, any data in the cache that has this tag should be considered outdated (invalidated)."
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} = productsApiSlice;
