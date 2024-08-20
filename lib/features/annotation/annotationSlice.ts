import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { annotationValue } from "@/types";

const initialState: { value: annotationValue } = {
  value: {
    isIndoor: false,
    isLoading: false,

    currentLine: 0,

    imageFileName: "",
    currentImageURL: null,
    currentEdgeAnnotation: null,

    currentImageAnnotations: [],
    currentImageJunctions: null,
    currentImageEdgePositives: [],
  } as annotationValue,
};

const annotationSlice = createSlice({
  name: "annotation",
  initialState,
  reducers: {
    updateIsIndoor(state, action: PayloadAction<boolean>) {
      state.value.isIndoor = action.payload;
    },
    updateIsLoading(state, action: PayloadAction<boolean>) {
      state.value.isLoading = action.payload;
    },

    updateCurrentLine(state, action: PayloadAction<number>) {
      state.value.currentLine = action.payload;
    },

    updateImageFileName(state, action: PayloadAction<string | null>) {
      state.value.imageFileName = action.payload;
    },
    updateCurrentImageURL(state, action: PayloadAction<string | null>) {
      state.value.currentImageURL = action.payload;
    },
    updateCurrentEdgeAnnotation(state, action: PayloadAction<string | null>) {
      state.value.currentEdgeAnnotation = action.payload;
    },

    updateCurrentImageAnnotations(state, action: PayloadAction<number[]>) {
      state.value.currentImageAnnotations = action.payload;
    },
    updateCurrentImageJunctions(state, action: PayloadAction<number[][]>) {
      state.value.currentImageJunctions = action.payload;
    },
    updateCurrentImageEdgePositives(state, action: PayloadAction<number[][]>) {
      state.value.currentImageEdgePositives = action.payload;
    },

    updateCurrentImageAnnotationAtIndex(
      state,
      action: PayloadAction<{ index: number; value: number }>
    ) {
      const { index, value } = action.payload;
      if (state.value.currentImageAnnotations) {
        state.value.currentImageAnnotations[index] = value;
      }
    },
    updateCurrentImageJunctionAtIndex(
      state,
      action: PayloadAction<{ index: number; value: number[] }>
    ) {
      const { index, value } = action.payload;
      if (state.value.currentImageJunctions) {
        state.value.currentImageJunctions[index] = value;
      }
    },
    updateCurrentImageEdgePositiveAtIndex(
      state,
      action: PayloadAction<{ index: number; value: number[] }>
    ) {
      const { index, value } = action.payload;
      if (state.value.currentImageEdgePositives) {
        state.value.currentImageEdgePositives[index] = value;
      }
    },
  },
});

export const {
  updateIsIndoor,
  updateIsLoading,
  updateCurrentLine,
  updateImageFileName,
  updateCurrentImageURL,
  updateCurrentEdgeAnnotation,
  updateCurrentImageJunctions,
  updateCurrentImageAnnotations,
  updateCurrentImageEdgePositives,
  updateCurrentImageJunctionAtIndex,
  updateCurrentImageAnnotationAtIndex,
  updateCurrentImageEdgePositiveAtIndex,
} = annotationSlice.actions;

export default annotationSlice.reducer;
