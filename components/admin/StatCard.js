import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function StatCard({ title, value }) {
    return (
        <Card className="p-3">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
} 