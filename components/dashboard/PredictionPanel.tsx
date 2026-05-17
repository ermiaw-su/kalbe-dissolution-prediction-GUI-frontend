"use client"

import { useState } from "react"

import UploadBox from "./UploadBox"
import Popup from "../PopUp"

type Props = {
    setPredictionResult: (data: any) => void
    loading: boolean
    setLoading: (loading: boolean) => void
}

export default function PredictionPanel({
    setPredictionResult,
    loading,
    setLoading
}: Props) {

    const [file, setFile] = useState<File | null>(null)

    const [error, setError] = useState("")

    const [popup, setPopup] = useState({
        show: false,
        message: ""
    })

    const handleRunPrediction = async () => {

        if (!file) {
            setPopup({
                show: true,
                message: "Please select a dataset file"
            })
            return
        }

        try {

            setLoading(true)

            const token = localStorage.getItem("token")

            /*
                STEP 1
                UPLOAD DATASET
            */

            const formData = new FormData()

            formData.append("dataset", file)

            const uploadRes = await fetch(
                `${process.env.NEXT_PUBLIC_DATASET_API}/api/datasets/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            )

            const uploadData = await uploadRes.json()

            if (!uploadRes.ok) {
                throw new Error(
                    uploadData.message || "Dataset upload failed"
                )
            }

            /*
                STEP 2
                GET DATASET ID
            */

            const datasetId = uploadData.dataset._id

            /*
                STEP 3
                RUN PREDICTION
            */

            const predictionRes = await fetch(
                `${process.env.NEXT_PUBLIC_PREDICTION_SERVICE}/api/predictions/run`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        datasetId
                    })
                }
            )

            const predictionData = await predictionRes.json()

            if (!predictionRes.ok) {
                throw new Error(
                    predictionData.message || "Prediction failed"
                )
            }

            /*
                STEP 4
                SAVE RESULT TO PARENT STATE
            */

            setPredictionResult(predictionData.prediction)

            /*
                SUCCESS POPUP
            */

            setPopup({
                show: true,
                message: "Prediction completed successfully"
            })

        } catch (err: any) {

            console.log(err)

            setError(err.message)

            setPopup({
                show: true,
                message: err.message
            })

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-start">

            <h2 className="font-semibold mb-2">
                Upload/
                <span className="text-blue-500">
                    {" "}Choose uploaded dataset
                </span>
            </h2>

            <p className="text-sm text-gray-500 mb-10">
                Please make sure the file format meets the requirement.
                Only .xlsx and .xls is allowed.
            </p>

            <UploadBox
                file={file}
                setFile={setFile}
            />

            {error && (
                <p className="text-red-500 text-sm mt-2">
                    {error}
                </p>
            )}

            <button
                onClick={handleRunPrediction}
                disabled={loading || !file}
                className="mt-6 bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {
                    loading
                        ? "Running Prediction..."
                        : "RUN PREDICTION MODEL"
                }
            </button>

            <Popup
                isOpen={popup.show}
                message={popup.message}
                onClose={() =>
                    setPopup({
                        show: false,
                        message: ""
                    })
                }
            />

        </div>
    )
}