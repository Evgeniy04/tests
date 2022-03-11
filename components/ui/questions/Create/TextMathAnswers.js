import { useDispatch, useSelector } from "react-redux";
import { deleteAnswer, editCorrectAnswer } from "../../../../features/createForm/createFormSlice";
import { Divider, IconButton, Radio as RadioMUI, Stack } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { red } from "@mui/material/colors";
import styles from "../../../../styles/Components/QuestionCreate.module.css";

export function TextMathAnswers(index) {
  const question = useSelector(
    (state) => state.createForm.form.questions[index]
  );
  const dispatch = useDispatch();

  let answerContent = question.allAnswersMML.map((answerMML, index) => (
    <div
      key={index}
      className={
        index === 0
          ? styles.answerContent + " " + styles.answerFirstChild
          : styles.answerContent
      }
    >
      <Stack
        direction="column"
        justifyContent="flex-end"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <IconButton
          onClick={() => {
            dispatch(deleteAnswer({ qid: question.id, aid: index }));
            dispatch(
              editCorrectAnswer({
                qid: question.id,
                correctAnswer: "",
              })
            );
          }}
          sx={{ color: red[800] }}
        >
          <DeleteForeverOutlinedIcon fontSize="medium" />
        </IconButton>
      </Stack>
      <div
        className={styles.answerEditorContainer}
        id={`editorAnswerQId${question.id}AId${index}`}
      />
    </div>
  ));

  return answerContent;
}
