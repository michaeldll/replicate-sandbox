import { useEffect, useRef, useState } from 'react'

const Upload = ({ onReady, onUpload }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    const urlRef = useRef()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        let interval = null
        interval = setInterval(() => {
            if (!window.cloudinary) return

            clearInterval(interval)
            setIsReady(true)
            typeof onReady === 'function' && onReady(true)

            cloudinaryRef.current = window.cloudinary
            widgetRef.current = cloudinaryRef.current.createUploadWidget({
                cloudName: 'dpu0yuehr',
                uploadPreset: 'qhhpnhfc'
            }, (error, result) => {
                if (error) console.error(error)
                // console.log(result);
                if (result.event === 'success' && typeof onUpload === 'function') {
                    // console.log(result.info.url);
                    urlRef.current = result.info.url
                    onUpload(result.info.url)
                }
            })
        }, 1000);
    }, [])

    return (
        isReady && (
            <button onClick={() => widgetRef.current.open()}>
                Upload
            </button >
        )

    )
};

export default Upload