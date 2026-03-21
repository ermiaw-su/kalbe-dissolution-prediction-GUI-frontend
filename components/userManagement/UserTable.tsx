
"use client";

import styles from "./UserTable.module.css";

type User = {
    _id: string;
    username: string;
    role: string;
    status: "active" | "inactive";
    createdBy: string;
    createdAt: string;
};

type Props = {
    title: string;
    users: User[];
    type: "active" | "inactive";
};

export default function UserTable({ title, users, type }: Props) {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const getToken = () => {
        const token = localStorage.getItem("token");

        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API}/api/users/user/${id}`, {
                method: "PUT",
                headers: getToken(),
                body: JSON.stringify({
                    status: "inactive",
                    role: "nonActive",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert("User deactivated");
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const handleReactivate = async (id: string) => {
        try {
            const res = await fetch(`${API}/api/users/user/${id}`, {
                method: "PUT",
                headers: getToken(),
                body: JSON.stringify({
                    status: "active",
                    role: "operator",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert("User reactivated");
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (id: string) => {
        const newUsername = prompt("Enter new username");
        const newEmail = prompt("Enter new email");
        const newRole = prompt("Enter new role");

        if (!newUsername || !newEmail) return;

        try {
            const res = await fetch(`${API}/api/users/user/${id}`, {
                method: "PUT",
                headers: getToken(),
                body: JSON.stringify({
                    username: newUsername,
                    email: newEmail,
                    role: newRole,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert("User updated");
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={styles.container}>
            <h4>{title}</h4>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Created By</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.createdAt}</td>
                            <td>{user.createdBy}</td>
                            <td>
                                {type === "active" ? (
                                    <>
                                        <button onClick={() => handleEdit(user._id)}>
                                            Edit
                                        </button>
                                        |
                                        <button onClick={() => handleDelete(user._id)}>
                                            Deactivate
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleReactivate(user._id)}
                                    >
                                        Reactivate
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}