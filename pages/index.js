import Head from "next/head";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bota lá</title>
      </Head>

      <main>
        <Nav />
        <h1>Make stuff with aRtIfIcIaL iNtElLiGeNcE 👆</h1>
      </main>
    </div>
  );
}
