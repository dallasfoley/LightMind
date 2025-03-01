import Resource from "@/components/dashboard/resources/resource";
import { resources } from "@/lib/constants";

export default function ResourcesPage() {
  return (
    <main>
      <h1 className="text-3xl md:text-5xl text-center mb-8">
        Crisis Helplines and Resources
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {resources.map((resource, id) => (
          <Resource resource={resource} key={id} />
        ))}
      </div>
    </main>
  );
}
