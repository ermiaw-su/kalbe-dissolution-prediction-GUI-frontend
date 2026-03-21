"use client";

import UserTable from "@/components/userManagement/UserTable";
import Button from "@/components/userManagement/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the User
type User = {
    _id: string;
    username: string;
    role: string;
    status: "active" | "inactive";
    createdAt: string;
    createdBy: string;
};

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            //Get the token
            const token = localStorage.getItem("token");

            //If there is no token, redirect to login
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/users/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch users");
                }

                //Take the response
                const result = await res.json();
                const rawUsers = result.data || result;

                //Format the users
                const formattedUsers = rawUsers.map((user: any) => ({
                    _id: user._id?.toString(),
                    username: user.username,
                    role: user.role,
                    status: user.status || "active",
                    createdBy: user.createdBy || user.created_by,
                    createdAt: new Date(
                        user.createdAt || user.created_at
                    ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }),
                }));

                setUsers(formattedUsers);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);

    const activeUsers = users.filter(
        (user) => user.role === "administrator" || user.role === "operator"
    );

    const inactiveUsers = users.filter(
        (user) => user.role === "nonActive"
    );

    return (
        <div>
            <UserTable
                title="List of Active Users"
                users={activeUsers}
                type="active"
            />

            <Link href="/userManagement/createUser">
                <Button label="Add New User" />
            </Link>

            <UserTable
                title="List of Inactive Users"
                users={inactiveUsers}
                type="inactive"
            />
        </div>
    );
}