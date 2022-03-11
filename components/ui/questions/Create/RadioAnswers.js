import { useDispatch, useSelector } from "react-redux";
import {
  deleteAnswer,
  editCorrectAnswer,
} from "../../../../features/createForm/createFormSlice";
import { Divider, IconButton, Radio as RadioMUI, Stack } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { green, grey, red } from "@mui/material/colors";
import styles from "../../../../styles/Components/QuestionCreate.module.css";

export function RadioAnswers(index) {
  const question = useSelector(
    (state) => state.createForm.form.questions[index]
  );
  const dispatch = useDispatch();

  const controlProps = (item) => ({
    checked: question.correctAnswer === item,
    onChange: () => {
      dispatch(
        editCorrectAnswer({
          qid: question.id,
          correctAnswer: item,
        })
      );
    },
    value: item,
    name: "answer-radio-button",
    inputProps: { "aria-label": item },
  });

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
            if (question.allAnswersMML.length > 1) {
              dispatch(deleteAnswer({ qid: question.id, aid: index }));
            }
          }}
          sx={{ color: red[800] }}
        >
          <DeleteForeverOutlinedIcon fontSize="medium" />
        </IconButton>
        <RadioMUI
          {...controlProps(`${index}`)}
          sx={{
            color: grey[600],
            "& .MuiSvgIcon-root": {
              width: 30,
              height: 30,
            },
            "&.Mui-checked": {
              color: green[800],
            },
          }}
        />
      </Stack>
      <div
        className={styles.answerEditorContainer}
        id={`editorAnswerQId${question.id}AId${index}`}
      />
    </div>
  ));

  return answerContent;
}
