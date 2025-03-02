import { resources } from "@/lib/constants";
import Resource from "@/components/dashboard/resources/resource";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ResourcesPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Crisis Helplines and Resources
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          If you or someone you know is experiencing a crisis, help is
          available. These resources are available 24/7 and provide confidential
          support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, id) => (
          <Resource resource={resource} key={id} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="mb-4 text-muted-foreground">
          Need more resources or information?
        </p>
        <Button variant="outline" className="group text-black">
          View additional support options
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </main>
  );
}
