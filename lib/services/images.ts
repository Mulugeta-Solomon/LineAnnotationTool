import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!SERVER_URL) throw Error("SERVER_URL is undefined");

export const imageAPI = createApi({
  reducerPath: "images",
  // TODO: Don't accept all content types curate
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "*/*"); // Accepting all content types
      return headers;
    },
    responseHandler: async (response) => {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else if (contentType && contentType.includes("image/")) {
        return response.blob();
      } else {
        return response.text();
      }
    },
  }),
  endpoints: (builder) => ({
    getImageData: builder.query({
      query: () => ({
        url: `/image_data`,
        method: "GET",
      }),
    }),
    getImage: builder.query({
      query: (id: string) => {
        const request = {
          url: `/image/${id}`,
          method: "GET",
        };
        return request;
      },
    }),
    changeImageStatus: builder.mutation({
      query: (id: string) => {
        const data = JSON.stringify({ data: id });
        const request = {
          url: `/alter`,
          method: "POST",
          body: data,
        };
        return request;
      },
    }),
    uploadImageData: builder.mutation({
      // TODO : Change data type by defining it in types
      query: (imageData) => {
        const request = {
          url: `/upload`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: imageData,
        };
        return request;
      },
    }),
  }),
});

export const {
  useGetImageDataQuery,
  useGetImageQuery,
  useUploadImageDataMutation,
  useChangeImageStatusMutation,
} = imageAPI;
