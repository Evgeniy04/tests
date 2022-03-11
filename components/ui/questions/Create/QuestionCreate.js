import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAnswer,
  copyQuestion,
  deleteQuestion,
  editAnswer,
  editAnswerTitle,
  editCorrectAnswer,
  setQuestionCheck,
  setQuestionObligatory,
  setQuestionPoints,
} from "../../../../features/createForm/createFormSlice";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { red, yellow } from "@mui/material/colors";
import { editorParams } from "../../../../constants/wiris";
import styles from "../../../../styles/Components/QuestionCreate.module.css";
import { RadioAnswers } from "./RadioAnswers";
import { CheckboxAnswers } from "./CheckboxAnswers";
import { TextMathAnswers } from "./TextMathAnswers";
import { GetSvg } from "../../../logic/GetSvg";

export function QuestionCreate(index, type) {
  const createForm = useSelector((state) => state.createForm);
  const question = useSelector(
    (state) => state.createForm.form.questions[index]
  );
  const dispatch = useDispatch();
  const [titleSVG, setTitleSVG] = useState(
    <Typography sx={{ color: "text.secondary" }}>Вопрос</Typography>
  );
  const [localExpanded, setLocalExpanded] = useState(false);
  useEffect(() => {
    (async () => {
      setTitleSVG(await GetSvg(question.titleMML));
    })();
  }, [localExpanded, createForm.deleteQuestion]);

  useEffect(() => {
    // При загрузке  и удалении вопросов обновить заголовок
    let elementId = `editorTitle${question.id}`;
    let editor;
    editor = com.wiris.jsEditor.JsEditor.newInstance(editorParams);
    editor.insertInto(document.getElementById(elementId));
    editor.setMathML(question.titleMML);
    // Cобытие отслеживания редактора
    let wrs_container = document.querySelector(
      `#${elementId} span.wrs_container`
    );
    let observer = new MutationObserver(function () {
      dispatch(
        editAnswerTitle({
          qid: question.id,
          titleMML: editor.getMathML().hexDecode(),
        })
      );
    });
    observer.observe(wrs_container, {
      childList: true,
    });
  }, [createForm.deleteQuestion]);

  useEffect(() => {
    const addEditorAnswer = (answerMML, aid) => {
      let elementId = `editorAnswerQId${question.id}AId${aid}`;
      let editor;
      editor = com.wiris.jsEditor.JsEditor.newInstance(editorParams);
      editor.insertInto(document.getElementById(elementId));
      let mml = answerMML.replace(/(?<=\s.*?)\s+/gs, "&#xA0;");
      editor.setMathML(mml);

      // Cобытие отслеживания редактора
      let wrs_container = document.querySelector(
        `#${elementId} span.wrs_container`
      );
      let observer = new MutationObserver(function () {
        if (question.type === "textmath") {
          dispatch(
            editCorrectAnswer({
              qid: question.id,
              correctAnswer: editor.getMathML().hexDecode(),
            })
          );
          dispatch(
            editAnswer({
              qid: question.id,
              aid: aid,
              answers: editor.getMathML().hexDecode(),
            })
          );
        } else {
          dispatch(
            editAnswer({
              qid: question.id,
              aid: aid,
              answers: editor.getMathML().hexDecode(),
            })
          );
        }
      });
      observer.observe(wrs_container, {
        childList: true,
      });
    };

    // При изменении ответов и удалении вопросов отрендерить повторно
    const { qid, aid } = createForm.updateAnswer;

    if (qid === question.id && aid !== -1) {
      let answerMML = question.allAnswersMML[aid];
      addEditorAnswer(answerMML, aid);
    } else if ((qid === -1 || qid === question.id) && aid === -1) {
      question.allAnswersMML.forEach((answerMML, index) => {
        const aid = index;
        addEditorAnswer(answerMML, aid);
      });
    }
  }, [createForm.updateAnswer, createForm.deleteQuestion]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Accordion
        className={styles.accordion}
        expanded={localExpanded === `panel${index}`}
        onChange={(event, isExpanded) => {
          setLocalExpanded(isExpanded ? `panel${index}` : false);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${index}bh-content`}
          id={`panel${index}bh-header`}
        >
          <div className={styles.titleSVGContainer}>{titleSVG}</div>
        </AccordionSummary>
        <AccordionDetails>
          <div
            className={styles.titleEditorContainer}
            id={`editorTitle${question.id}`}
          />
          {(() => {
            switch (type) {
              case "radio":
              case "select":
                return RadioAnswers(index);
              case "checkbox":
                return CheckboxAnswers(index);
              case "textmath":
                return TextMathAnswers(index);
              default:
                return <></>;
            }
          })()}
          <Stack
            direction="row"
            justifyContent="flex-end"
            marginBottom="10px"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <TextField
              type="number"
              min="0"
              max="100"
              value={question.points}
              style={{ backgroundColor: "#ebf4f8" }}
              onChange={(event) => {
                if (
                  (+event.target.value === 0 ||
                    !event.target.value.startsWith(0)) &&
                  Number.isInteger(+event.target.value) &&
                  event.target.value >= 0 &&
                  event.target.value <= 100
                ) {
                  dispatch(
                    setQuestionPoints({
                      qid: question.id,
                      points: event.target.value,
                    })
                  );
                }
              }}
              label="Баллы"
            />
            {(() => {
              if (
                question.type === "textmath" &&
                !question.allAnswersMML.length
              ) {
                return (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      dispatch(
                        addAnswer({
                          qid: question.id,
                        })
                      );
                    }}
                  >
                    Добавить вариант
                  </Button>
                );
              } else if (question.type !== "textmath") {
                return (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      dispatch(
                        addAnswer({
                          qid: question.id,
                        })
                      );
                    }}
                  >
                    Добавить вариант
                  </Button>
                );
              }
            })()}
          </Stack>

          <Stack
            direction="row"
            borderTop="#c8cfd6 solid 1px"
            justifyContent="flex-end"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
          >
            <IconButton
              aria-label="delete"
              onClick={() => {
                if (createForm.form.questions.length > 1) {
                  dispatch(deleteQuestion({ qid: question.id }));
                }
              }}
            >
              <DeleteForeverOutlinedIcon
                fontSize="medium"
                sx={{ color: red[800] }}
              />
            </IconButton>
            <IconButton
              aria-label="copy"
              onClick={() => {
                dispatch(copyQuestion({ qid: question.id }));
              }}
            >
              <ContentCopyIcon fontSize="medium" sx={{ color: yellow[800] }} />
            </IconButton>
            <FormControlLabel
              control={<Switch />}
              label="Проверять ответ"
              labelPlacement="start"
              checked={question.check}
              onChange={(event) => {
                dispatch(
                  setQuestionCheck({
                    qid: question.id,
                    check: event.target.checked,
                  })
                );
              }}
            />
            <FormControlLabel
              control={<Switch />}
              label="Обязательный вопрос"
              labelPlacement="start"
              checked={question.isObligatory}
              onChange={(event) => {
                dispatch(
                  setQuestionObligatory({
                    qid: question.id,
                    isObligatory: event.target.checked,
                  })
                );
              }}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
