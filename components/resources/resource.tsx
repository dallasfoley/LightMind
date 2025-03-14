import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { ResourceType } from "@/schema/resourceSchema";
import Link from "next/link";
import {
  Phone,
  MessageSquare,
  Globe,
  ExternalLink,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Resource({ resource }: { resource: ResourceType }) {
  return (
    <Card className="overflow-hidden p-4 text-black transition-all duration-300 hover:shadow-lg hover:border-primary/50 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl md:text-2xl font-bold">
            {resource.title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="py-4 flex-grow space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-base">
            <Phone className="h-4 w-4 text-primary" />
            <span className="font-medium">Call:</span>
            <a
              href={`tel:${resource.number.replace(/\D/g, "")}`}
              className="hover:text-primary transition-colors"
            >
              {resource.number}
            </a>
          </div>

          {resource.text && (
            <div className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-medium">Text:</span>
              <span>{resource.text}</span>
            </div>
          )}

          {resource.TTY && (
            <div className="flex items-center gap-2 text-base">
              <Headphones className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-medium">TTY:</span>
              <span>{resource.TTY}</span>
            </div>
          )}
        </div>

        {resource.description && (
          <p className="text-sm text-muted-foreground pt-2 border-t border-border">
            {resource.description}
          </p>
        )}
      </CardContent>

      {resource.onlineChat && (
        <CardFooter className="pt-2 pb-4">
          <Button variant="outline" asChild className="w-full gap-2 group">
            <Link
              href={resource.onlineChat}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="h-4 w-4" />
              <span>Chat Online</span>
              <ExternalLink className="h-3 w-3 ml-auto transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      )}

      {resource.meeting && (
        <CardFooter className="pt-2 pb-4">
          <Button variant="outline" asChild className="w-full gap-2 group">
            <Link
              href={resource.meeting}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="h-4 w-4" />
              <span>Find a Meeting</span>
              <ExternalLink className="h-3 w-3 ml-auto transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
