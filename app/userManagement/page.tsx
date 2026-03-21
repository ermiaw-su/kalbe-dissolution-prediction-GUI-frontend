import UserTable from "@/components/userManagement/UserTable";
import Button from "@/components/userManagement/Button";
import Link from "next/link";

type User = {
    _id: string;
    username: string;
    role: string;
    status: "active" | "inactive";
    createdAt: string;
    createdBy: string;
};

async function getUsers(): Promise<User[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/users`,
            {
                cache: "no-store",
            }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch users");
        }

        const result = await res.json();

        const rawUsers = result.data || result;

        return rawUsers.map((user: any) => ({
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
    } catch (error) {
        console.log(error);
        return [];
    }
}

export default async function UserManagementPage() {
    const users = await getUsers();

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