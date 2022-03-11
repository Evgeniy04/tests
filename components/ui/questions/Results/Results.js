import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Radio as RadioMUI } from "@mui/material";
import { Checkbox as CheckboxMUI } from "@mui/material";
import { green, grey, red, yellow } from "@mui/material/colors";
import { GetSvg } from "../../../logic/GetSvg";
import styles from "../../../../styles/Components/QuestionFill.module.css";

export function Results(type, index, titleSvg, questionAllAnswersSvg) {
  const answerOnQuestions = useSelector(
    (state) => state.form.form.answersOnQuestions[index]
  );
  const [textMathAnswerSVG, setTextMathAnswerSVG] = useState([]);

  useEffect(() => {
    (async () => {
      if (
        answerOnQuestions.answers !==
        '<math xmlns="http://www.w3.org/1998/Math/MathML"/>'
      ) {
        let svg = await GetSvg(answerOnQuestions.answers);
        setTextMathAnswerSVG(svg);
      }
    })();
  }, [answerOnQuestions.answers]);

  let answerContent = [];
  switch (type) {
    case "radio":
    case "select":
      answerContent = questionAllAnswersSvg.map((svg, index) => (
        <div
          key={index}
          className={
            index === 0
              ? styles.answerContent + " " + styles.answerFirstChild
              : styles.answerContent
          }
        >
          {/* Если ответ есть, он соответствует этому полю или это правильный ответ, то тогда оно будет активно, при условии, что оно проверяется */}
          <RadioMUI
            disabled
            checked={
              (answerOnQuestions.answers !== "" &&
                +answerOnQuestions.answers) === index ||
              (answerOnQuestions.check &&
                +answerOnQuestions.correctAnswer === index)
            }
            value={index}
            name="answer-radio-button"
            inputProps={{ "aria-label": index }}
            sx={{
              color: grey[600],
              "& .MuiSvgIcon-root": {
                width: 30,
                height: 30,
              },
              // Если поле проверяется, то при условии, что правильный ответ будет соответствовать этому полю, оно будет зеленым,
              // если не будет соостветствовать - красным, если поле не проверяется - серым.
              "&.Mui-checked": {
                color: answerOnQuestions.check
                  ? +answerOnQuestions.correctAnswer === index
                    ? green[800]
                    : red[800]
                  : grey[800],
              },
            }}
          />
          <div className={styles.titleSvg}>{svg}</div>
        </div>
      ));
      break;
    case "checkbox":
      answerContent = questionAllAnswersSvg.map((svg, index) => {
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
              disabled
              checked={
                answerOnQuestions.answers[index] === true ||
                (answerOnQuestions.check &&
                  answerOnQuestions.correctAnswer[index] === true)
              }
              value={index}
              name="answer-checkbox-button"
              inputProps={{ "aria-label": index }}
              sx={{
                color: grey[600],
                "& .MuiSvgIcon-root": {
                  width: 30,
                  height: 30,
                },
                // Если поле проверяется, то при условии, что правильный ответ будет соответствовать этому полю, оно будет зеленым,
                // если не будет соостветствовать - красным, если поле не проверяется - серым.
                "&.Mui-checked": {
                  color: answerOnQuestions.check
                    ? answerOnQuestions.correctAnswer[index] === true
                      ? green[800]
                      : red[800]
                    : grey[800],
                },
              }}
            />
            <div className={styles.titleSvg}>{svg}</div>
          </div>
        );
      });
      break;
    case "textmath":
      answerContent = questionAllAnswersSvg.map((svg, index) => (
        <div
          key={index}
          className={
            index === 0
              ? styles.answerContent +
                " " +
                styles.answerFirstChild +
                " " +
                styles.titleSvg
              : styles.answerContent + " " + styles.titleSvg
          }
        >
          {(() => {
            if (answerOnQuestions.check) {
              if (answerOnQuestions.correctly) {
                return (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <div className={styles.titleSvg}>{textMathAnswerSVG}</div>
                  </span>
                );
              } else {
                return (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Ваш ответ:<span>&nbsp;</span>
                      <div className={styles.titleSvg}>{textMathAnswerSVG}</div>
                    </span>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Правильный ответ:<span>&nbsp;</span>
                      <div className={styles.titleSvg}>{svg}</div>
                    </span>
                  </div>
                );
              }
            } else {
              return (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    Ваш ответ:<span>&nbsp;</span>
                    <div className={styles.titleSvg}>{textMathAnswerSVG}</div>
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    Правильный ответ:<span>&nbsp;</span>
                    <div className={styles.titleSvg}>{svg}</div>
                  </span>
                </div>
              );
            }
          })()}
        </div>
      ));

      if (
        !questionAllAnswersSvg.length &&
        answerOnQuestions.answers !==
          '<math xmlns="http://www.w3.org/1998/Math/MathML"/>'
      )
        answerContent = (
          <div
            key={0}
            className={
              styles.answerContent +
              " " +
              styles.answerFirstChild +
              " " +
              styles.titleSvg
            }
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <div className={styles.titleSvg}>{textMathAnswerSVG}</div>
            </span>
          </div>
        );
      break;
  }

  return (
    <>
      <div className={styles.main} key={index}>
        <span
          className={styles.title}
          style={(() => {
            // Если вопрос не обязательный, заголовок будет жёлтым.
            // Если вопрос обязательный, при условии, ответ проверяется и он верный - заголовок зеленый, не верный - красный. Не проверяется - серый.
            let styles = {};
            if (answerOnQuestions.isObligatory) {
              if (answerOnQuestions.check) {
                if (answerOnQuestions.correctly) {
                  styles.backgroundColor = green[500];
                } else {
                  styles.backgroundColor = red[500];
                }
              } else {
                styles.backgroundColor = grey[500];
              }
            } else {
              styles.backgroundColor = yellow[500];
            }
            return styles;
          })()}
        >
          <div
            className={styles.titleSvg}
            style={{
              marginRight: 10,
              width: "80%",
            }}
          >
            {titleSvg}
          </div>
          <span className={styles.points}>
            {(() => {
              return answerOnQuestions.check
                ? answerOnQuestions.points + " баллов"
                : "Не проверялся";
            })()}
          </span>
        </span>
        {answerContent}
      </div>
    </>
  );
}
