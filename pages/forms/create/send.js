import Head from "next/head";
import Link from "next/link";
import { useSelector } from "react-redux";
import mainStyles from "../../../styles/Main.module.css";
import styles from "../../../styles/Send.module.css";

export default function Home({}) {
  const createForm = useSelector((state) => state.createForm);

  return (
    <div className={mainStyles.container}>
      <style global jsx>{`
        html,
        body {
          min-width: 400px;
        }
      `}</style>
      <Head>
        <title>Поделиться формой</title>
        <meta name="description" content="Send form" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main
        className={styles.main}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: 20,
            paddingRight: 20,
            wordBreak: "break-word",
          }}
        >
          <Link href={`/forms/fill/${createForm._id}`}>
            <a>
              <h3 style={{ textAlign: "center" }}>
                Ссылка на заполнение формы
              </h3>
            </a>
          </Link>
          {/* <Link href={`/forms/create/${createForm._id}`}>
            <a>
              <h3 style={{ textAlign: "center" }}>
                Ссылка на редактирование формы
              </h3>
            </a>
          </Link> */}
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
