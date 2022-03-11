import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Backdrop,
  Fab,
  Snackbar,
  SpeedDial,
  SpeedDialAction,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import MuiAlert from "@mui/material/Alert";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CircularProgress from "@mui/material/CircularProgress";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SendIcon from "@mui/icons-material/Send";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { green } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuestion,
  fetchFormCreate,
  formSubmission,
  setFormDescription,
  setFormTitle,
} from "../../../features/createForm/createFormSlice";
import Question from "../../../components/ui/Question";
import mainStyles from "../../../styles/Main.module.css";
import styles from "../../../styles/Create.module.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const actions = [
  {
    icon: <RadioButtonCheckedIcon />,
    name: "Один из списка",
    questionType: "radio",
    key: "SpeedDialIcon0",
  },
  {
    icon: <CheckBoxIcon />,
    name: "Несколько из списка",
    questionType: "checkbox",
    key: "SpeedDialIcon1",
  },
  {
    icon: <ArrowDropDownCircleIcon />,
    name: "Раскрывающийся список",
    questionType: "select",
    key: "SpeedDialIcon2",
  },
  {
    icon: <FormatIndentIncreaseIcon />,
    name: "Свой ответ",
    questionType: "textmath",
    key: "SpeedDialIcon3",
  },
];

export default function Home({}) {
  const router = useRouter();
  const createForm = useSelector((state) => state.createForm);
  const form = useSelector((state) => state.createForm.form);
  const dispatch = useDispatch();
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const onCreateQuestion = (type) => {
    let index = form.questions.length;
    switch (type) {
      default:
        dispatch(
          createQuestion({
            id: index,
            type: type,
            isObligatory: true,
            titleMML: `<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>В</mi><mi>о</mi><mi>п</mi><mi>р</mi><mi>о</mi><mi>с</mi></math>`,
            allAnswersMML:
              type === "textmath"
                ? []
                : [
                    "<math xmlns='http://www.w3.org/1998/Math/MathML'><mi>В</mi><mi>а</mi><mi>р</mi><mi>и</mi><mi>а</mi><mi>н</mi><mi>т</mi><mo>&#xA0;</mo><mi>1</mi></math>",
                  ],
            check: true,
            points: 0,
            correctAnswer:
              type === "checkbox" ? [true] : type === "textmath" ? "" : "0",
          })
        );
    }
  };

  let questionsContent = form.questions.map((question, index) => {
    return <Question key={index} index={index} type={question.type} isCreate />;
  });

  useEffect(() => {
    createForm._id.length && router.push(`/forms/create/send/`);
  }, [createForm._id, router]);

  return createForm.submission ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : (
    <div className={mainStyles.container}>
      <style global jsx>{`
        html,
        body {
          min-width: 710px;
        }
      `}</style>
      <Head>
        <title>Создать форму</title>
        <meta name="description" content="Create form" />
        <link rel="icon" href="/favicon.svg" />
        <script src="https://www.wiris.net/demo/editor/editor"></script>
      </Head>

      <main className={styles.main}>
        <div className={styles.externalСontainer}>
          <div className={styles.innerСontainer}>
            <TextField
              className={styles.title}
              id="title-text-field"
              label="Введите название формы"
              variant="outlined"
              value={form.title}
              onChange={(event) => {
                dispatch(setFormTitle({ title: event.target.value }));
              }}
            />
            <TextField
              className={styles.description}
              id="description-text-field"
              label="Введите описание формы"
              variant="outlined"
              value={form.description}
              onChange={(event) => {
                dispatch(
                  setFormDescription({ description: event.target.value })
                );
              }}
            />
            {questionsContent}
            <Fab
              sx={{
                color: "#ebf4f8",
                backgroundColor: green[600],
                "&:hover": {
                  backgroundColor: green[800],
                },
              }}
              variant="extended"
              onClick={() => {
                if (form.title.length && form.description.length) {
                  dispatch(formSubmission());
                  dispatch(fetchFormCreate());
                } else {
                  setOpenErrorSnackbar(true);
                }
              }}
            >
              <SendIcon className={styles.sendIcon} />
              <span>&nbsp;</span>
              Отправить
            </Fab>
          </div>
          <div className={styles.boxButtonsMenu}>
            <Box className={styles.addIcon}>
              <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{
                  transform: "rotate(180deg)",
                }}
                icon={<SpeedDialIcon />}
                open={openSpeedDial}
                onClick={() => {
                  setOpenSpeedDial(!openSpeedDial);
                }}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    sx={{ transform: "rotate(180deg)" }}
                    key={action.key}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={() => {
                      onCreateQuestion(action.questionType);
                    }}
                  />
                ))}
              </SpeedDial>
            </Box>
          </div>
          <Snackbar
            open={openErrorSnackbar}
            autoHideDuration={6000}
            onClose={() => {
              setOpenErrorSnackbar(false);
            }}
            message="Note archived"
          >
            <Alert
              onClose={() => {
                setOpenErrorSnackbar(false);
              }}
              severity="error"
              sx={{ width: "100%" }}
            >
              Заполните все обязательные поля!
            </Alert>
          </Snackbar>
        </div>
      </main>

      {/* <footer className={mainStyles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={mainStyles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
}
