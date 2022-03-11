import { configureStore } from "@reduxjs/toolkit";
import createFormReducer from "../features/createForm/createFormSlice";
import formReducer from "../features/form/formSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    createForm: createFormReducer,
  },
});
