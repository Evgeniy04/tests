import { useDispatch, useSelector } from "react-redux";
import {
  Divider,
  IconButton,
  Checkbox as CheckboxMUI,
  Stack,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { green, grey, red } from "@mui/material/colors";
import {
  deleteAnswer,
  editCorrectAnswer,
} from "../../../../features/createForm/createFormSlice";
import styles from "../../../../styles/Components/QuestionCreate.module.css";

export function CheckboxAnswers(index) {
  const question = useSelector(
    (state) => state.createForm.form.questions[index]
  );
  const dispatch = useDispatch();

  const addItem = (item) => {
    let value = [...question.correctAnswer];
    value[item] = false;
    dispatch(
      editCorrectAnswer({
        qid: question.id,
        correctAnswer: value,
      })
    );
    return false;
  };

  const handleChange = (event) => {
    let value = [...question.correctAnswer];
    value[event.target.value] = !value[event.target.value];
    dispatch(
      editCorrectAnswer({
        qid: question.id,
        correctAnswer: value,
      })
    );
  };

  const controlProps = (item) => {
    return {
      checked:
        question.correctAnswer[item] === undefined
          ? addItem(item)
          : question.correctAnswer[item],
      onChange: handleChange,
      value: item,
      name: "answer-checkbox-button",
      inputProps: { "aria-label": item },
    };
  };

  let value = [...question.correctAnswer];
  let answerContent = question.allAnswersMML.map((answerMML, index) => {
    value[index] = false;
    return (
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
          <CheckboxMUI
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
    );
  });

  return answerContent;
}
