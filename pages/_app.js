import "../styles/globals.css";
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="https://upload-widget.cloudinary.com/latest/global/all.js" />
      <Component {...pageProps} />;
    </>
  )
}
