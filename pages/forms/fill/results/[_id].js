import { useEffect, useState } from "react";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { Backdrop, Chip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { blue, green, red, yellow } from "@mui/material/colors";
import { url_api } from "../../../../constants/api";
import { createForm } from "../../../../features/form/formSlice";
import { GetSvg } from "../../../../components/logic/GetSvg";
import Question from "../../../../components/ui/Question";
import mainStyles from "../../../../styles/Main.module.css";
import styles from "../../../../styles/Fill.module.css";

export default function Results({ answers }) {
  const dispatch = useDispatch();
  const [fillingQuestionsContent, setFillingQuestionsContent] = useState([]);
  useEffect(() => {
    (async () => {
      // redux state
      dispatch(createForm(answers));

      // Getting a test svg to display mathematical expressions
      let questionsAllAnswersSvg = await answers.answersOnQuestions.map(
        async (question) => {
          return await Promise.all(
            question.allAnswersMML.map(async (mml) => await GetSvg(mml))
          );
        }
      );

      // Getting a title svg to display mathematical expressions
      let questionsAllTitleSvg = await answers.answersOnQuestions.map(
        async (question) => {
          return await GetSvg(question.titleMML);
        }
      );

      questionsAllAnswersSvg = await Promise.all(questionsAllAnswersSvg);
      questionsAllTitleSvg = await Promise.all(questionsAllTitleSvg);

      // Create questions
      setFillingQuestionsContent(
        answers.answersOnQuestions.map((question, index) => (
          <Question
            key={question.id}
            index={index}
            type={question.type}
            questionAllAnswersSvg={questionsAllAnswersSvg[index]}
            titleSvg={questionsAllTitleSvg[index]}
            isResults
          />
        ))
      );
    })();
  }, [answers, dispatch]);

  return (
    <div className={mainStyles.container}>
      <Head>
        <title>Результаты</title>
        <meta name="description" content="Result form" />
        <link rel="icon" href="/favicon.svg" />
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h1 className={styles.title}>{answers.title}</h1>
              <span
                style={{
                  paddingRight: 20,
                  paddingTop: 31.44,
                  wordBreak: "break-all",
                }}
              >
                <Chip
                  style={(() => {
                    let styles = {};
                    if (answers.totalPoints === answers.ofPoints) {
                      styles.backgroundColor = green[500];
                    } else if (answers.totalPoints === 0) {
                      styles.backgroundColor = red[500];
                    } else if (answers.totalPoints < answers.ofPoints) {
                      styles.backgroundColor = yellow[500];
                    }
                    return styles;
                  })()}
                  label={`${answers.totalPoints}/${answers.ofPoints} баллов`}
                  variant="outlined"
                />
              </span>
            </div>
            <h4 className={styles.description}>
              {answers.description.replace(/{([\s\S]+?)}/g, "")}
              {(() => {
                let result = answers.description.match(/{([\s\S]+?)}/);
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

export async function getServerSideProps({ params }) {
  let { _id } = params;

  let response = await fetch(`${url_api}forms/get/${_id}`, {
    method: "GET",
  });

  let answers;
  if (response.ok) {
    answers = await response.json();

    if (answers === null) {
      return { notFound: true };
    } else {
      return {
        props: {
          answers,
        },
      };
    }
  } else {
    console.log("Error HTTP: " + response.status);
    return { notFound: true };
  }
}
