import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { url_api } from "../../constants/api";

const initialState = {
  form: {},
  submission: false,
  _id: "",
};

export const fetchFormSubmission = createAsyncThunk(
  "form/requestFetchFormSubmission",
  async (data, thunkAPI) => {
    let response = await fetch(`${url_api}forms/fill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await thunkAPI.getState().form),
    });
    if (response.ok) {
      const { _id } = await response.json();
      return _id;
    } else {
      return response;
    }
  }
);

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    createForm: (state, action) => {
      state.form = action.payload;
    },
    editAnswer: (state, action) => {
      const { index, answers } = action.payload;
      state.form.answersOnQuestions[index].answers = answers;
    },
    setFieldsFilled: (state, action) => {
      const { index, value } = action.payload;
      state.form.answersOnQuestions[index].fieldsFilled = value;
    },
    formSubmission: (state) => {
      state.submission = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFormSubmission.fulfilled, (state, action) => {
      state._id = action.payload;
    });
  },
});

export const { createForm, editAnswer, setFieldsFilled, formSubmission } =
  formSlice.actions;

export default formSlice.reducer;
