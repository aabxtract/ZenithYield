"use client";

import { useWallet } from "@/context/wallet-context";
import { ADMIN_ADDRESS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle } from "lucide-react";
import { PoolManagementList } from "./pool-management-list";

export function AdminPageContent() {
    const { address } = useWallet();
    const isAdmin = address === ADMIN_ADDRESS;

    if (!isAdmin) {
        return (
            <Card className="max-w-xl mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-destructive/20 p-3 rounded-full w-fit">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="mt-4">Access Denied</CardTitle>
                    <CardDescription>
                        You do not have permission to view this page. This area is for administrators only.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }


    return (
        <div>
            <PoolManagementList />
        </div>
    );
}
