"use client"

import { useState } from "react"

import PredictionPanel from "./PredictionPanel"
import ResultPanel from "./ResultPanel"

export default function DashboardLayput({
    role
}: {
    role: "administrator" | "operator"
}) {

    const [predictionResult, setPredictionResult] = useState<any>(null)

    const [loading, setLoading] = useState(false)

    return (
        <div className="min-h-screen flex flex-col">

            <div className="flex flex-col md:flex-row bg-white w-full h-[calc(100vh-80px)]">

                <PredictionPanel
                    setPredictionResult={setPredictionResult}
                    loading={loading}
                    setLoading={setLoading}
                />

                <ResultPanel
                    predictionResult={predictionResult}
                    loading={loading}
                />

            </div>

        </div>
    )
}