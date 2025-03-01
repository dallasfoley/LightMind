import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResourceType } from "@/schema/resourceSchema";
import Link from "next/link";

export default function Resource({ resource }: { resource: ResourceType }) {
  return (
    <Card className="p-4 bg-slate-800">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent className="md:text:lg">
        <h3>Call: {resource.number}</h3>
        {resource.text && <h3>Text: {resource.text}</h3>}
        {resource.TTY && <h3>TTY: {resource.TTY}</h3>}
        {resource.onlineChat && (
          <h3>
            Online Chat:{" "}
            <Link
              href={resource.onlineChat}
              className="text-blue-600 underline"
            >
              {resource.onlineChat}
            </Link>
          </h3>
        )}
      </CardContent>
    </Card>
  );
}
