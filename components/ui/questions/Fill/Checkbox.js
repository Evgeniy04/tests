import { useDispatch, useSelector } from "react-redux";
import { Checkbox as CheckboxMUI } from "@mui/material";
import { green, grey, red } from "@mui/material/colors";
import {
  editAnswer,
  setFieldsFilled,
} from "../../../../features/form/formSlice";
import styles from "../../../../styles/Components/QuestionFill.module.css";

export function Checkbox(index, titleSvg, questionAllAnswersSvg) {
  const answerOnQuestions = useSelector(
    (state) => state.form.form.answersOnQuestions[index]
  );
  const dispatch = useDispatch();

  const addItem = (item) => {
    let value = [...answerOnQuestions.answers];
    value[item] = false;
    dispatch(editAnswer({ index: index, answers: value }));
    return false;
  };

  const handleChange = (event) => {
    let value = [...answerOnQuestions.answers];
    value[event.target.value] = !value[event.target.value];
    dispatch(editAnswer({ index: index, answers: value }));
  };

  const controlProps = (item) => {
    return {
      checked:
        answerOnQuestions.answers[item] === undefined
          ? addItem(item)
          : answerOnQuestions.answers[item],
      onChange: handleChange,
      value: item,
      name: "answer-checkbox-button",
      inputProps: { "aria-label": item },
    };
  };

  let value = [...answerOnQuestions.answers];
  let answerContent = questionAllAnswersSvg.map((svg, index) => {
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
        <div className={styles.titleSvg}>{svg}</div>
      </div>
    );
  });

  return (
    <>
      <div className={styles.main} key={index}>
        <span
          className={styles.title}
          style={(() => {
            if (
              answerOnQuestions.isObligatory &&
              !answerOnQuestions.answers.filter((value) => value === true)
                .length
            ) {
              dispatch(setFieldsFilled({ index, value: false }));
              return {
                backgroundColor: red[500],
              };
            } else {
              dispatch(setFieldsFilled({ index, value: true }));
              return { backgroundColor: green[500] };
            }
          })()}
        >
          <div className={styles.titleSvg}>{titleSvg}</div>
        </span>
        {answerContent}
      </div>
    </>
  );
}
