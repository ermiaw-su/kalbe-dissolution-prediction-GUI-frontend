"use client";

import { useState, useEffect } from "react";
import styles from "./fileTable.module.css";

type User = {
    _id: string;
    username: string;
};

type Report = {
    _id: string;
    datasetName: string;

    uploadedBy: User;
    reportCreatedBy?: User;

    predictionResult: string;
    createdAt: string;

    predictionId?: string;
};

export default function DatasetReportTable() {
    const [data, setData] = useState<Report[]>([]);
    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API}/api/dataset-reports`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();
            setData(result.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleExport = async (predictionId?: string) => {
        if (!predictionId) {
            alert("Report not available");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API}/api/predictions/export/${predictionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (data.filePath) {
                window.open(`${API}/${data.filePath}`, "_blank");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Dataset Report</h2>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Dataset</th>
                        <th>Uploaded By</th>
                        <th>Prediction Result</th>
                        <th>Report Created By</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={6}>No data</td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>

                                <td>{item.datasetName}</td>

                                <td>
                                    {item.uploadedBy?.username || "-"}
                                </td>

                                <td>
                                    {item.predictionId ? (
                                        <span
                                            className={styles.link}
                                            onClick={() =>
                                                handleExport(item.predictionId)
                                            }
                                        >
                                            {item.predictionResult}
                                        </span>
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td>
                                    {item.reportCreatedBy?.username || "-"}
                                </td>

                                <td>
                                    {new Date(item.createdAt).toLocaleDateString(
                                        "id-ID"
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}