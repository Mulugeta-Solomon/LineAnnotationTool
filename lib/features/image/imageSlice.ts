import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Dimensions {
  width: number;
  height: number;
}

interface ImageState {
  dimensions: Dimensions;
}

const initialState: ImageState = {
  dimensions: { width: 0, height: 0 },
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    updateDimensions(state, action: PayloadAction<Dimensions>) {
      state.dimensions = action.payload;
    },
  },
});

export const { updateDimensions } = imageSlice.actions;
export default imageSlice.reducer;
