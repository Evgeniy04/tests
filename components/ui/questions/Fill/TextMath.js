import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { green, red } from "@mui/material/colors";
import { editorParams } from "../../../../constants/wiris";
import {
  editAnswer,
  setFieldsFilled,
} from "../../../../features/form/formSlice";
import styles from "../../../../styles/Components/QuestionFill.module.css";

export function TextMath(index, titleSvg) {
  const answerOnQuestions = useSelector(
    (state) => state.form.form.answersOnQuestions[index]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Создать редактор
    let elementId = `editorAnswerQId${index}`;
    let editor;
    editor = com.wiris.jsEditor.JsEditor.newInstance(editorParams);
    editor.insertInto(document.getElementById(elementId));

    // Добавить событие отслеживания редактора
    let wrs_container = document.querySelector(
      `#${elementId} span.wrs_container`
    );
    let observer = new MutationObserver(function () {
      dispatch(
        editAnswer({ index: index, answers: editor.getMathML().hexDecode() })
      );
    });
    observer.observe(wrs_container, {
      childList: true,
    });
  }, [index, dispatch]);

  return (
    <>
      <div className={styles.main} key={index}>
        <span
          className={styles.title}
          style={(() => {
            if (
              answerOnQuestions.isObligatory &&
              answerOnQuestions.answers ===
                '<math xmlns="http://www.w3.org/1998/Math/MathML"/>'
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
        <div
          className={styles.editorContainer + " " + styles.answerFirstChild}
          id={`editorAnswerQId${index}`}
        />
      </div>
    </>
  );
}
