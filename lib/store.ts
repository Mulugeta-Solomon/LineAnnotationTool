import { setupListeners } from "@reduxjs/toolkit/query";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";

import annotationReducer from "@/lib/features/annotation/annotationSlice";
import imageReducer from "@/lib/features/image/imageSlice";

import { imageAPI } from "./services/images";

export const store = configureStore({
  reducer: {
    annotationReducer,
    imageReducer,
    [imageAPI.reducerPath]: imageAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["imageAPI/getImage/fulfilled"],
        ignoredActionPaths: ["payload"],
        ignoredPaths: ["meta.baseQueryMeta.request"],
      },
    }).concat(imageAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

setupListeners(store.dispatch);
