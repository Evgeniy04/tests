import { Radio as RadioMUI } from "@mui/material";
import { green, grey, red } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  editAnswer,
  setFieldsFilled,
} from "../../../../features/form/formSlice";
import styles from "../../../../styles/Components/QuestionFill.module.css";

export function Radio(index, titleSvg, questionAllAnswersSvg) {
  const answerOnQuestions = useSelector(
    (state) => state.form.form.answersOnQuestions[index]
  );
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(
      editAnswer({
        index: index,
        answers: event.target.value,
      })
    );
  };

  const controlProps = (item) => ({
    checked: answerOnQuestions.answers === item,
    onChange: handleChange,
    value: item,
    name: "answer-radio-button",
    inputProps: { "aria-label": item },
  });

  let answerContent = questionAllAnswersSvg.map((svg, index) => (
    <div
      key={index}
      className={
        index === 0
          ? styles.answerContent + " " + styles.answerFirstChild
          : styles.answerContent
      }
    >
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
      <div className={styles.titleSvg}>{svg}</div>
    </div>
  ));

  return (
    <>
      <div className={styles.main} key={index}>
        <span
          className={styles.title}
          style={(() => {
            if (
              answerOnQuestions.isObligatory &&
              answerOnQuestions.answers === ""
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
