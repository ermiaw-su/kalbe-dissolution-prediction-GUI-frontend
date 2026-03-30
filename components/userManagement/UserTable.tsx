
"use client";

import styles from "./UserTable.module.css";
import Modal from "@/components/Modal";
import EditUserForm from "@/components/userManagement/editUser";
import { useState } from "react";

type User = {
    _id: string;
    userId: string;
    username: string;
    email: string;
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

    //Deactivate
    const [showConfirm, setShowConfirm] = useState(false);
    const [selUserId, setSelUserId] = useState<string | null>(null);

    //Edit
    const [showEdit, setShowEdit] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const API = process.env.NEXT_PUBLIC_API_URL;

    const getToken = () => {
        const token = localStorage.getItem("token");

        if(!token) {
            alert("Unauthorized");
            return;
        }

        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    const handleDelete = async () => {
        if (!selUserId) return;

        try {
            const res = await fetch(`${API}/api/users/deactivate/${selUserId}`, {
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

            setShowConfirm(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const handleReactivate = async (id: string) => {
        try {
            const res = await fetch(`${API}/api/users/reactivate/${id}`, {
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

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>{title}</h4>

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
                            <td>{user.userId}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.createdAt}</td>
                            <td>{user.createdBy}</td>
                            <td>
                                {type === "active" ? (
                                    <>
                                        <button onClick={() => {
                                            setEditUser(user);
                                            setShowEdit(true);
                                        }}>
                                            Edit
                                        </button>
                                        |
                                        <button onClick={() => {
                                            setSelUserId(user._id);
                                            setShowConfirm(true);
                                        }}>
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

            {/* Deactivate Confirm */}
            {showConfirm && (
                <div className={styles.overlay}>
                    <div className={styles.confirmBox}>
                        <h2 className={styles.title}>DEACTIVATE USER</h2>

                        <p className={styles.text}>
                            Are you sure you want to deactivate this user?
                        </p>

                        <p className={styles.subText}>
                            Inactive user will be shown and can be reactivated
                        </p>

                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.noBtn}
                                onClick={() => setShowConfirm(false)}
                            >
                                No
                            </button>

                            <button
                                className={styles.yesBtn}
                                onClick={() => handleDelete()}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit */}
            <Modal
                isOpen={showEdit}
                onClose={() => setShowEdit(false)}
            >
                {editUser && (
                    <EditUserForm
                        user={editUser}
                        onClose={() => setShowEdit(false)}
                        onSuccess={() => window.location.reload()}
                    />
                )}

            </Modal>
        </div>
    );
    
}