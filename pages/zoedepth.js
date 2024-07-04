import { useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import Upload from "../components/Upload";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Zoedepth() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const [ready, setReady] = useState(false);
  const urlRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!urlRef.current) {
      setError('Image missing')
      return
    } else {
      setError(null)
    }

    // create prediction
    const response = await fetch("/api/zoedepth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: 'ZoeD_N',
        img: urlRef.current,
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

      <h1>
        Estimate depth with {" "}
        <a href="https://replicate.com/cjwbw/zoedepth">
          zoedepth
        </a>
        :
      </h1>

      {!ready && <p>Loading...</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* <input
          type="text"
          name="model"
          placeholder="Enter a model type"
          defaultValue={"ZoeD_N"}
        /> */}

        {/* <textarea
          type="text"
          name="img"
          placeholder="Enter an image HTTPS URL"
          defaultValue={""}
        /> */}

        <Upload
          onReady={() => {
            setReady(true)
          }}
          onUpload={(url) => {
            console.log(url);
            urlRef.current = url
            setUrl(url)
            setError(null)
          }}
        />
        {url && <div className="url">
          Target image:
          <div className={styles.imageWrapper}>
            <Image
              src={url}
              alt="url"
              width={300}
              height={300}
            />
          </div>
        </div>}
        {ready && <button type="submit">Go!</button>}
      </form>

      {error && <div className="error">{error}</div>}

      {prediction && (
        <div>
          {prediction.output && (
            <div className={styles.imageWrapper}>
              <Image
                src={prediction.output}
                alt="output"
                width={300}
                height={300}
              />
            </div>
          )}
          <p>status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}
