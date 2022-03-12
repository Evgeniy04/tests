import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { url_api } from "../../constants/api";

const initialState = {
  form: {
    title: "Новая форма",
    description: "Описание",
    questions: [
      {
        id: 0,
        type: "radio",
        isObligatory: true,
        titleMML: `<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>В</mi><mi>о</mi><mi>п</mi><mi>р</mi><mi>о</mi><mi>с</mi></math>`,
        allAnswersMML: [
          "<math xmlns='http://www.w3.org/1998/Math/MathML'><mi>В</mi><mi>а</mi><mi>р</mi><mi>и</mi><mi>а</mi><mi>н</mi><mi>т</mi><mo> </mo><mn>1</mn></math>",
        ],
        check: true,
        points: 0,
        correctAnswer: "0",
      },
    ],
  },
  deleteQuestion: false,
  updateAnswer: { update: false, qid: -1, aid: -1 },
  submission: false,
  _id: "",
  editId: "",
};

export const fetchFormCreate = createAsyncThunk(
  "form/requestfetchFormCreate",
  async (data, thunkAPI) => {
    let response = await fetch(`${url_api}forms/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await thunkAPI.getState().createForm),
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return response;
    }
  }
);

export const fetchFormEdit = createAsyncThunk(
  "form/requestfetchFormEdit",
  async (data, thunkAPI) => {
    let response = await fetch(`${url_api}forms/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await thunkAPI.getState().createForm),
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return response;
    }
  }
);

export const createFormSlice = createSlice({
  name: "createForm",
  initialState,
  reducers: {
    editForm: (state, action) => {
      state.form = action.payload;
    },
    createQuestion: (state, action) => {
      state.form.questions.push(action.payload);
      // Вызывает событие обновления и обновляет все ответы в созданном вопросе
      state.updateAnswer = {
        update: !state.updateAnswer.update,
        qid: action.payload.id,
        aid: -1,
      };
    },
    copyQuestion: (state, action) => {
      const { qid } = action.payload;
      let index = state.form.questions.length;
      let newQuestion = { ...state.form.questions[qid] };
      newQuestion.id = index;
      state.form.questions.push(newQuestion);
      // Вызывает событие обновления и обновляет все ответы в созданном вопросе
      state.updateAnswer = {
        update: !state.updateAnswer.update,
        qid: newQuestion.id,
        aid: -1,
      };
    },
    deleteQuestion: (state, action) => {
      const { qid } = action.payload;
      state.form.questions.splice(qid, 1);
      state.form.questions.forEach((element, index) => {
        state.form.questions[index].id = index;
      });
      state.deleteQuestion = !state.deleteQuestion;
      // Вызывает событие обновления и обновляет все ответы во всех вопросах
      state.updateAnswer = {
        update: !state.updateAnswer.update,
        qid: -1,
        aid: -1,
      };
    },
    setFormTitle: (state, action) => {
      const { title } = action.payload;
      state.form.title = title;
    },
    setFormDescription: (state, action) => {
      const { description } = action.payload;
      state.form.description = description;
    },
    editCorrectAnswer: (state, action) => {
      const { qid, correctAnswer } = action.payload;
      state.form.questions[qid].correctAnswer = correctAnswer;
    },
    addAnswer: (state, action) => {
      const { qid } = action.payload;
      state.form.questions[qid].allAnswersMML.push(
        `<math xmlns='http://www.w3.org/1998/Math/MathML'><mi>В</mi><mi>а</mi><mi>р</mi><mi>и</mi><mi>а</mi><mi>н</mi><mi>т</mi><mo> </mo><mn>${
          state.form.questions[qid].allAnswersMML.length + 1
        }</mn></math>`
      );
      // Вызывает событие обновления и добавляет один ответ
      state.updateAnswer = {
        update: !state.updateAnswer.update,
        qid,
        aid: state.form.questions[qid].allAnswersMML.length - 1,
      };
    },
    deleteAnswer: (state, action) => {
      const { qid, aid } = action.payload;
      let correctAnswer = state.form.questions[qid].correctAnswer;

      if (typeof state.form.questions[qid].correctAnswer === "object") {
        // Если тип вопроса checkbox, то удалить из объекта вариант ответа на вопрос
        state.form.questions[qid].correctAnswer.splice(aid, 1);
      } else {
        // Меняет правильные ответ, при сдвиге вопросов
        if (correctAnswer === aid.toString()) {
          state.form.questions[qid].correctAnswer = "0";
        } else if (correctAnswer > aid.toString()) {
          state.form.questions[qid].correctAnswer = (
            Number(correctAnswer) - 1
          ).toString();
        }
      }

      // Удалить ответ
      state.form.questions[qid].allAnswersMML.splice(aid, 1);

      // Вызывает событие обновления и обновляет все ответы
      state.updateAnswer = { update: !state.updateAnswer.update, qid, aid: -1 };
    },
    editAnswerTitle: (state, action) => {
      const { qid, titleMML } = action.payload;
      if (state.form.questions.length && state.form.questions[qid])
        state.form.questions[qid].titleMML = titleMML;
    },
    editAnswer: (state, action) => {
      const { qid, aid, answers } = action.payload;
      if (state.form.questions.length && state.form.questions[qid])
        state.form.questions[qid].allAnswersMML[aid] = answers;
    },
    setQuestionObligatory: (state, action) => {
      const { qid } = action.payload;
      if (state.form.questions.length && state.form.questions[qid])
        state.form.questions[qid].isObligatory = action.payload.isObligatory;
    },
    setQuestionCheck: (state, action) => {
      const { qid } = action.payload;
      if (state.form.questions.length && state.form.questions[qid])
        state.form.questions[qid].check = action.payload.check;
    },
    setQuestionPoints: (state, action) => {
      const { qid } = action.payload;
      if (state.form.questions.length && state.form.questions[qid])
        state.form.questions[qid].points = action.payload.points;
    },
    formSubmission: (state) => {
      state.submission = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFormCreate.fulfilled, (state, action) => {
      state._id = action.payload._id;
      state.editId = action.payload.editId;
    });
    builder.addCase(fetchFormEdit.fulfilled, (state, action) => {
      state._id = state.form._id;
      state.editId = state.form.editId;
    });
  },
});

export const {
  editForm,
  createQuestion,
  copyQuestion,
  deleteQuestion,
  setFormTitle,
  setFormDescription,
  editCorrectAnswer,
  addAnswer,
  deleteAnswer,
  editAnswerTitle,
  editAnswer,
  setQuestionObligatory,
  setQuestionCheck,
  setQuestionPoints,
  formSubmission,
} = createFormSlice.actions;

export default createFormSlice.reducer;
