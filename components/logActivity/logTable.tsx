"use client";

import { useState, useEffect } from "react";
import styles from "./logTable.module.css";

type Log = {
    _id: string;
    description: string;
    doneBy: string;
    role: string;
    createdAt: string;
};

export default function LogTable() {
    const [logs, setLogs] = useState<Log[]>([]);
    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(`${API}/api/logs`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch logs");
                }

                setLogs(data.data || data.logs || []);
            } catch (error) {
                console.log(error);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Activity Log</h2>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Activity</th>
                        <th>Timestamp</th>
                        <th>Done by</th>
                        <th>User's Role</th>
                    </tr>
                </thead>

                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan={5} className={styles.empty}>
                                No activity yet
                            </td>
                        </tr>
                    ) : (
                        logs.map((log, index) => (
                            <tr key={log._id}>
                                <td>{index + 1}</td>

                                <td>{log.description}</td>

                                <td>
                                    {log.createdAt
                                        ? new Date(log.createdAt).toLocaleString("id-ID", {
                                            day: "numeric",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "-"}
                                </td>

                                <td>{log.doneBy}</td>

                                <td>{log.role}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}