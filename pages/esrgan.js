import { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import Upload from "../components/Upload";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Esrgan() {
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [ready, setReady] = useState(false);
    const urlRef = useRef()
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!urlRef.current) {
            setError('Image missing')
            return
        } else {
            setError(null)
        }

        // create prediction
        // console.log(e.target.face_enhance.checked, e.target.image.value, e.target.scale.value);
        const response = await fetch("/api/esrgan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: urlRef.current,
                scale: parseFloat(e.target.scale.value),
                face_enhance: e.target.face_enhance.checked,
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
            await sleep(500);
            // get specific prediction
            const response = await fetch("/api/esrgan/" + prediction.id);
            prediction = await response.json();
            if (response.status !== 200) {
                setError(prediction.detail);
                return;
            }
            console.log({ prediction });
            setPrediction(prediction);
        }

        console.log(prediction);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Bota lá - Upscale</title>
            </Head>

            <Nav />

            <h1>
                Upscale with <a href="https://replicate.com/nightmareai/real-esrgan">ESRGAN</a>:
            </h1>

            {!ready && <p>Loading...</p>}

            <form className={styles.form} onSubmit={handleSubmit}>
                {ready && <>
                    <label>Resolution scale:</label>
                    <input type="number" name="scale" defaultValue={4} placeholder="4" min="1" max="10" step={0.1} />
                    <label>Improve faces:</label>
                    <input type="checkbox" name="face_enhance" />
                    <label>Image URL:</label>
                </>}

                <Upload
                    onReady={() => {
                        setReady(true)
                    }}
                    onUpload={(url) => {
                        console.log(url);
                        urlRef.current = url
                        setUrl(url)
                        setError(null)
                    }} />
                {url && <div className="url">{url}</div>}
                {error && <div className="error">{error}</div>}
                {ready && <button type="submit">Go!</button>}
            </form>

            {error && <div className="error">{error}</div>}

            {prediction && (
                <div className={styles.imageWrapperWrapper}>
                    {prediction.output && (
                        <div className={styles.imageWrapper}>
                            <Image
                                fill
                                src={prediction.output}
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
