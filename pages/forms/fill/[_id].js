import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Button, Fab, Modal, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { blue, green } from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import { url_api } from "../../../constants/api";
import { GetSvg } from "../../../components/logic/GetSvg";
import Question from "../../../components/ui/Question";
import {
  createForm,
  fetchFormSubmission,
  formSubmission,
} from "../../../features/form/formSlice";
import mainStyles from "../../../styles/Main.module.css";
import styles from "../../../styles/Fill.module.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home({ form }) {
  const router = useRouter();
  const reduxForm = useSelector((state) => state.form);
  const dispatch = useDispatch();
  const [fillingQuestionsContent, setFillingQuestionsContent] = useState([]);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const modalHandleChange = () => {
    if (
      !reduxForm.form.answersOnQuestions.filter(
        (answer) => answer.fieldsFilled === false
      ).length
    ) {
      setOpenModal(!openModal);
    } else {
      setOpenErrorSnackbar(true);
    }
  };

  const requestFormSubmission = () => {
    modalHandleChange();
    dispatch(formSubmission());
    dispatch(fetchFormSubmission());
  };

  useEffect(() => {
    (async () => {
      // redux state
      let answersOnQuestions = form.questions.map((question) => ({
        questionId: question.id,
        type: question.type,
        titleMML: question.titleMML,
        allAnswersMML: question.allAnswersMML,
        answers: question.type === "checkbox" ? [] : "",
        isObligatory: question.isObligatory,
        fieldsFilled: false,
      }));
      dispatch(
        createForm({
          formId: form._id,
          title: form.title,
          description: form.description,
          answersOnQuestions,
        })
      );

      // Getting a test svg to display mathematical expressions
      let questionsAllAnswersSvg = await form.questions.map(
        async (question) => {
          return await Promise.all(
            question.allAnswersMML.map(async (mml) => await GetSvg(mml))
          );
        }
      );

      // Getting a title svg to display mathematical expressions
      let questionsAllTitleSvg = await form.questions.map(async (question) => {
        return await GetSvg(question.titleMML);
      });

      questionsAllAnswersSvg = await Promise.all(questionsAllAnswersSvg);
      questionsAllTitleSvg = await Promise.all(questionsAllTitleSvg);

      // Create questions
      setFillingQuestionsContent(
        form.questions.map((question, index) => (
          <Question
            key={question.id}
            index={index}
            type={question.type}
            questionAllAnswersSvg={questionsAllAnswersSvg[index]}
            titleSvg={questionsAllTitleSvg[index]}
          />
        ))
      );
    })();
  }, [form, dispatch]);

  useEffect(() => {
    reduxForm._id.length && router.push(`/forms/fill/results/${reduxForm._id}`);
  }, [reduxForm._id, router]);

  return reduxForm.submission ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : (
    <div className={mainStyles.container}>
      <Head>
        <title>Заполнение формы</title>
        <meta name="description" content="Fill form" />
        <link rel="icon" href="/favicon.svg" />
        <script src="https://www.wiris.net/demo/editor/editor"></script>
      </Head>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!fillingQuestionsContent.length}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <main className={styles.main}>
        <div>
          <div>
            <h1 className={styles.title}>{form.title}</h1>
            <h4 className={styles.description}>
              {form.description.replace(/{([\s\S]+?)}/g, "")}
              {(() => {
                let result = form.description.match(/{([\s\S]+?)}/);
                return result !== null ? (
                  <a
                    target="noopener"
                    href={result[1]}
                    style={{ color: blue[500] }}
                  >
                    [Материал для изучения]
                  </a>
                ) : (
                  <></>
                );
              })()}
            </h4>
          </div>
          {fillingQuestionsContent}
          <div className={styles.send_button}>
            <Fab
              sx={{
                color: "#ebf4f8",
                backgroundColor: green[600],
                "&:hover": {
                  backgroundColor: green[800],
                },
              }}
              variant="extended"
              onClick={modalHandleChange}
            >
              <SendIcon className={styles.sendIcon} />
              <span>&nbsp;</span>
              Отправить
            </Fab>
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
        <Modal
          open={openModal}
          onClose={modalHandleChange}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={styles.box_modal}>
            <h3 id="parent-modal-title">Вы готовы отправить форму?</h3>
            <Button onClick={modalHandleChange}>Нет</Button>
            <Button onClick={requestFormSubmission}>Да</Button>
          </Box>
        </Modal>
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

export async function getServerSideProps({ params }) {
  let { _id } = params;
  let response = await fetch(`${url_api}forms/fill/${_id}`, {
    method: "GET",
  });
  let form;
  if (response.ok) {
    form = await response.json();

    if (form === null) {
      return { notFound: true };
    } else {
      return {
        props: {
          form,
        },
      };
    }
  } else {
    console.log("Error HTTP: " + response.status);
    return { notFound: true };
  }
}
