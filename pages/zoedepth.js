import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Zoedepth() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // create prediction
    const response = await fetch("/api/zoedepth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: e.target.model.value,
        img: e.target.img.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      // get specific prediction
      const response = await fetch("/api/sdiffusion/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <Nav />

      <p>
        Estimate depth with {" "}
        <a href="https://replicate.com/cjwbw/zoedepth">
          zoedepth
        </a>
        :
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="model"
          placeholder="Enter a model type"
          defaultValue={"ZoeD_N"}
        />
        <textarea
          type="text"
          name="img"
          placeholder="Enter an image HTTPS URL"
          defaultValue={""}
        />
        <button type="submit">Go!</button>
      </form>

      {error && <div className="error">{error}</div>}

      {prediction && (
        <div>
          {prediction.output && (
            <div className={styles.imageWrapper}>
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p>status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}
