import { useDispatch, useSelector } from "react-redux";
import {
  Select as SelectMUI,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import {
  editAnswer,
  setFieldsFilled,
} from "../../../../features/form/formSlice";
import styles from "../../../../styles/Components/QuestionFill.module.css";

export function Select(index, titleSvg, questionAllAnswersSvg) {
  const answerOnQuestions = useSelector(
    (state) => state.form.form.answersOnQuestions[index]
  );
  const dispatch = useDispatch();

  let answerContent = questionAllAnswersSvg.map((svg, index) => (
    <MenuItem key={index} value={index}>
      <div className={styles.titleSvg}>{svg}</div>
    </MenuItem>
  ));

  const handleChange = (event) => {
    dispatch(
      editAnswer({
        index: index,
        answers: event.target.value.toString(),
      })
    );
  };

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
        <div className={styles.answerContent + " " + styles.answerFirstChild}>
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel id="select-label">Ответ</InputLabel>
            <SelectMUI
              labelId="select-label"
              id="select"
              value={answerOnQuestions.answers}
              label="Выбрать"
              onChange={handleChange}
            >
              {answerContent}
            </SelectMUI>
          </FormControl>
        </div>
      </div>
    </>
  );
}
