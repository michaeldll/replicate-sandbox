import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Sdxl() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // create prediction
    const response = await fetch("/api/sdxl-lcm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
        width: e.target.width.value,
        height: e.target.height.value,
        no_lcm: e.target["no-lcm"].checked,
        steps: e.target.steps.value,
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
      await sleep(200);
      // get specific prediction
      const response = await fetch("/api/sdxl-lcm/" + prediction.id);
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

      <h1>
        RORO GENERATOR {" "}
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          type="text"
          name="prompt"
          placeholder="Enter a prompt"
          rows="8" cols="100"
          defaultValue={"Close up photography of an astronaut riding a rainbow unicorn, cinematic, dramatic, leica 35mm summilux"}
        />
        <label>Modèle lourd:</label>
        <input type="checkbox" name="no-lcm" />
        <label>Qualité:</label>
        <input type="number" name="steps" defaultValue={19} placeholder="19" min="1" max="50" step={1} />
        <label>Width:</label>
        <input type="number" name="width" defaultValue={2048} placeholder="2048" min="1" max="2048" step={1} />
        <label>Height:</label>
        <input type="number" name="height" defaultValue={2048} placeholder="2048" min="1" max="2048" step={1} />
        <label>Image URL:</label>
        <input type="url"></input>
        <button type="submit">Go!</button>
        <br />
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

      <footer>
        Model:{" "}
        <a href="https://replicate.com/lucataco/sdxl-lcm/api?tab=node">
          sdxl-lcm
        </a>
      </footer>
    </div>
  );
}
