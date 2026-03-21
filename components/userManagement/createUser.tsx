"use client"

import {useState} from "react";
import styles from "./createUser.module.css";

export default function createUserForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("operator");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const baseURL = process.env.NEXT_PUBLIC_API_URL;

            console.log(baseURL);

            const token = localStorage.getItem("token");

            if (!baseURL) {
                throw new Error("API URL is not defined");
            }
            //Send the request
            const res = await fetch(
                `${baseURL}/api/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                        role,
                    }),
                }
            );

            //Take the response
            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to create user");
                return;
            }
            alert("User created!")
        } catch (error) {
            console.error(error);
            alert("Failed to create user");
        }
    };

    return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create New User</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username</label>
          <input
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Role</label>
          <select
            className={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="operator">Operator</option>
            <option value="administrator">Administrator</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </div>
  );
}