"use client"

import { useRef } from "react"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

import ReportTemplate from "./ReportTemplate"

type Props = {
    predictionResult: any
    loading: boolean
}

export default function ResultPanel({
    predictionResult,
    loading
}: Props) {

    const reportRef = useRef<HTMLDivElement>(null)

    /*
        DOWNLOAD PDF
    */

    const handleDownload = async () => {

        try {

            if (!reportRef.current) return

            /*
                STEP 1
                CAPTURE HTML
            */

            const images =
                reportRef.current.querySelectorAll("img")

            await Promise.all(
                Array.from(images).map((img) => {

                    if (img.complete) {
                        return Promise.resolve()
                    }

                    return new Promise((resolve) => {
                        img.onload = resolve
                        img.onerror = resolve
                    })
                })
            )

            await new Promise((resolve) =>
                setTimeout(resolve, 500)
            )

            const canvas =
                await html2canvas(
                    reportRef.current,
                    {
                        scale: 2,
                        useCORS: true,
                    }
                )

            const imageData =
                canvas.toDataURL("image/png")

            /*
                STEP 2
                GENERATE PDF
            */

            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: "a4"
            })

            const pdfWidth =
                pdf.internal.pageSize.getWidth()

            const pdfHeight =
                (canvas.height * pdfWidth)
                / canvas.width

            pdf.addImage(
                imageData,
                "PNG",
                0,
                0,
                pdfWidth,
                pdfHeight
            )

            if (pdfHeight > pdf.internal.pageSize.getHeight()) {

                pdf.addPage()

                pdf.setFontSize(18)

                pdf.text(
                    "Prediction Results",
                    40,
                    40
                )

                let y = 80

                representativeResult.forEach((item: any) => {

                    pdf.rect(40, y, 120, 30)
                    pdf.rect(160, y, 140, 30)
                    pdf.rect(300, y, 140, 30)
                    pdf.rect(440, y, 120, 30)

                    pdf.text(item.time_point, 50, y + 20)

                    pdf.text(
                        String(item.actual_dissolution_pct),
                        170,
                        y + 20
                    )

                    pdf.text(
                        String(item.predicted_dissolution_pct),
                        310,
                        y + 20
                    )

                    pdf.text(
                        item.ok_nok,
                        450,
                        y + 20
                    )

                    y += 30
                })
            }

            /*
                STEP 3
                GENERATE PDF BLOB
            */

            const pdfBlob =
                pdf.output("blob")

            /*
                STEP 4
                AUTO DOWNLOAD
            */

            pdf.save("prediction-report.pdf")

            /*
                STEP 5
                UPLOAD PDF TO BACKEND
            */

            const token =
                localStorage.getItem("token")

            const formData =
                new FormData()

            formData.append(
                "report",
                pdfBlob,
                "prediction-report.pdf"
            )

            formData.append(
                "datasetId",
                predictionResult.datasetId
            )

            formData.append(
                "predictionId",
                predictionResult._id
            )

            formData.append(
                "datasetName",
                predictionResult.datasetName
            )

            formData.append(
                "predictionResult",
                "Completed"
            )

            const uploadRes = await fetch(
                `${process.env.NEXT_PUBLIC_DATASET_API}/api/reports/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            )

            const uploadData =
                await uploadRes.json()

            if (!uploadRes.ok) {
                throw new Error(
                    uploadData.message
                )
            }

            console.log(
                "Report uploaded successfully"
            )

        } catch (error) {

            console.log(error)
        }
    }

    /*
        LOADING STATE
    */

    if (loading) {

        return (

            <div className="w-full md:w-1/2 p-8 border-l flex items-center justify-center">

                <p className="text-gray-500">
                    Running prediction...
                </p>

            </div>
        )
    }

    /*
        EMPTY STATE
    */

    if (!predictionResult) {

        return (

            <div className="w-full md:w-1/2 p-8 border-l flex flex-col">

                <h2 className="font-semibold mb-4">
                    DISSOLUTION PROFILE RESULT
                </h2>

                <div className="flex-1 flex items-center justify-center text-gray-500 text-sm text-center">

                    Result will be displayed here once the prediction model has been run

                </div>

                <div className="flex justify-center mt-6">

                    <button
                        disabled
                        className="bg-green-700 text-white px-6 py-2 rounded font-semibold opacity-50 cursor-not-allowed"
                    >
                        DOWNLOAD REPORT
                    </button>

                </div>

            </div>
        )
    }

    /*
        RESULT STATE
    */

    const representativeResult =
    predictionResult.representativeResult || []

    const graphUrl =
        `${process.env.NEXT_PUBLIC_FLASK_API}${predictionResult.representativePlot}`

    return (

        <div className="w-full md:w-1/2 p-8 border-l flex flex-col">

            <h2 className="font-semibold mb-4">
                DISSOLUTION PROFILE RESULT
            </h2>

            {/* GRAPH */}

            <div className="border rounded p-4">

                <img
                    src={graphUrl}
                    alt="Prediction Graph"
                    className="w-full rounded"
                />

            </div>

            {/* RESULT TABLE */}

            <table className="w-full mt-6 border border-collapse">

                <thead>

                    <tr className="bg-green-700 text-white">

                        <th className="border p-2">
                            Time Point
                        </th>

                        <th className="border p-2">
                            Predicted (%)
                        </th>

                        <th className="border p-2">
                            Status
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {representativeResult.map((item: any, index: number) => (

                        <tr key={index}>

                            <td className="border p-2 text-center">
                                {item.time_point}
                            </td>

                            <td className="border p-2 text-center">
                                {item.predicted_dissolution_pct}
                            </td>

                            <td className="border p-2 text-center">

                                <span
                                    className={
                                        item.ok_nok === "OK"
                                            ? "text-green-700 font-semibold"
                                            : "text-red-600 font-semibold"
                                    }
                                >
                                    {item.ok_nok}
                                </span>

                            </td>

                        </tr>

                    ))}

                </tbody>

                

            </table>

            {/* DOWNLOAD BUTTON */}

            <div className="flex justify-center mt-6">

                <button
                    onClick={handleDownload}
                    style={{
                        backgroundColor: "#15803d",
                        color: "#ffffff"
                    }}
                    className="px-6 py-2 rounded font-semibold"
                >
                    DOWNLOAD REPORT
                </button>

            </div>

            {/* HIDDEN PDF TEMPLATE */}

            <div className="fixed -left-[9999px] top-0">

                <div ref={reportRef}>

                    <ReportTemplate
                        predictionResult={predictionResult}
                    />

                </div>

            </div>

        </div>
    )
}