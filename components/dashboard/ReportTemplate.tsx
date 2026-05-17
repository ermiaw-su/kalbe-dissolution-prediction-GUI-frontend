"use client"

import kalbeLogo from "@/public/images/kalbe-logo.png"

type Props = {
    predictionResult: any
}

export default function ReportTemplate({
    predictionResult
}: Props) {

    if (!predictionResult) return null

    const representativeResult =
        predictionResult.representativeResult || []

    const graphUrl =
        `${process.env.NEXT_PUBLIC_FLASK_API}${predictionResult.representativePlot}`

    const cellStyle = {
        border: "1px solid #000",
        padding: "10px",
        fontSize: "14px",
        textAlign: "center" as const
    }

    return (

        <div
            id="pdf-report"
            style={{
                backgroundColor: "#ffffff",
                width: "1100px",
                minHeight: "750px",
                padding: "40px",
                fontFamily: "Arial, sans-serif",
                color: "#000000"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "30px"
                }}
            >

                {/* LEFT */}

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "flex-start"
                    }}
                >

                    <img
                        src={kalbeLogo.src}
                        alt="kalbe-logo"
                        style={{
                            width: "120px",
                            height: "auto"
                        }}
                    />

                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginTop: "8px"
                        }}
                    >
                        <p>
                            <strong>Report date:</strong>
                            {" "}
                            {new Date(
                                predictionResult.createdAt
                            ).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Report by:</strong>
                            {" "}
                            {predictionResult.generatedByName || "Unknown User"}
                        </p>
                    </div>

                </div>

                {/* RIGHT */}

                <div
                    style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginTop: "8px"
                    }}
                >
                    created by R&D Pharma
                </div>

            </div>

            {/* MAIN CONTENT */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "40px",
                    marginTop: "40px"
                }}
            >

                {/* GRAPH SECTION */}

                <div
                    style={{
                        width: "52%"
                    }}
                >

                    <h3
                        style={{
                            textAlign: "center",
                            marginBottom: "20px",
                            fontSize: "18px",
                            fontWeight: "bold"
                        }}
                    >
                        Metformin HCl Dissolution Profile
                    </h3>

                    <img
                        src={graphUrl}
                        alt="Prediction Graph"
                        crossOrigin="anonymous"
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "contain"
                        }}
                    />

                </div>

                {/* TABLE SECTION */}

                <div
                    style={{
                        width: "40%"
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={cellStyle}>
                                    <div
                                        style={{
                                            backgroundColor: "#d9d9d9",
                                            margin: "-10px",
                                            padding: "10px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Time
                                    </div>
                                </th>

                                <th style={cellStyle}>
                                    <div
                                        style={{
                                            backgroundColor: "#d9d9d9",
                                            margin: "-10px",
                                            padding: "10px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        % Dissolution
                                    </div>
                                </th>

                                <th style={cellStyle}>
                                    <div
                                        style={{
                                            backgroundColor: "#d9d9d9",
                                            margin: "-10px",
                                            padding: "10px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Remark
                                    </div>
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {representativeResult.map((item: any, index: number) => (

                                <tr key={index}>

                                    <td style={cellStyle}>
                                        {item.time_point}
                                    </td>

                                    <td style={cellStyle}>
                                        {item.predicted_dissolution_pct}
                                    </td>

                                    <td style={cellStyle}>
                                        {item.ok_nok}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* FOOTER SECTION */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "80px"
                }}
            >

                {/* APPROVAL */}

                <div
                    style={{
                        width: "40%",
                        fontSize: "14px",
                        fontWeight: "bold",
                        lineHeight: "2"
                    }}
                >
                    <p>Approved by:</p>
                    <p>Position:</p>
                    <p>Date:</p>
                </div>

                {/* COMMENT */}

                <div
                    style={{
                        width: "40%",
                        fontSize: "14px",
                        fontWeight: "bold"
                    }}
                >
                    <p>Comment:</p>
                </div>

            </div>

        </div>
    )
}