import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Riffusion() {
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // create prediction
        const response = await fetch("/api/riffusion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: e.target.prompt.value,
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
            const response = await fetch("/api/riffusion/" + prediction.id);
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
                <title>Bota lá - Music</title>
            </Head>

            <Nav />

            <h1>
                Music with{" "}
                <a href="https://replicate.com/hmartiro/riffusion">
                    riffusion
                </a>
                :
            </h1>

            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="prompt"
                    placeholder="Enter a prompt to predict"
                />
                <button type="submit">Go!</button>
            </form>

            {error && <div>{error}</div>}

            {prediction && (
                <div>
                    {prediction.output && (
                        <>
                            <p>Result :</p>
                            <audio
                                controls
                                src={prediction.output.audio}>
                                <a href={prediction.output.audio}>
                                    Download audio
                                </a>
                            </audio>
                            <p>Spectogram :</p>
                            <img src={prediction.output.spectrogram} alt="spectogram" />
                        </>
                    )}
                    <p>status: {prediction.status}</p>
                </div>
            )}
        </div>
    );
}
