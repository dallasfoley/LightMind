import { resources } from "@/lib/constants";
import Resource from "@/components/resources/resource";
import Link from "next/link";

export default function ResourcesPage() {
  return (
    <div className="relative">
      {/* Fixed navigation sidebar */}
      <div className="hidden md:block fixed right-4 lg:right-8 top-48 z-10">
        <div className="p-4 rounded-lg w-48">
          <h3 className="text-lg md:text-xl text-zinc-900 dark:text-white font-medium mb-2">
            On this page
          </h3>
          <nav className="flex flex-col space-y-2">
            <Link
              href="#s1"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              Crisis Resources and Helplines
            </Link>
            <Link
              href="#s2"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              Learn
            </Link>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-12">
          <div className="md:pr-52">
            <h1
              id="s1"
              className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent text-center"
            >
              Crisis Helplines and Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4 text-center">
              If you or someone you know is experiencing a crisis, help is
              available. These resources are available 24/7 and provide
              confidential support.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:pr-52">
          {resources.map((resource, id) => (
            <Resource resource={resource} key={id} />
          ))}
        </div>

        <h1
          id="s2"
          className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mt-16 mb-8 md:pr-52"
        >
          Learn
        </h1>
        <div className="flex flex-col items-center md:pr-52">
          <Link
            href="https://qprinstitute.com/pdfs/Forever_Decision.pdf"
            className="mt-8 text-center underline text-xl md:text-3xl text-slate-400 dark:hover:text-white hover:text-black"
          >
            The Forever Decision
          </Link>
          <p className="mt-4 text-center text-zinc-900 dark:text-zinc-200">
            For those thinking about suicide, and for those who know, love, or
            counsel them, this book discusses the social aspects of suicide, the
            right to die, anger, loneliness, depression, stress, hopelessness,
            drug and alcohol abuse, the consequences of a suicide attempt, and
            how to get help.
          </p>
          <Link
            href="https://www.samhsa.gov/mental-health"
            className="mt-8 text-center underline text-xl md:text-3xl text-slate-400 dark:hover:text-white hover:text-black"
          >
            Substance Abuse and Mental Health Services Administration (SAMHSA)
          </Link>
          <p className="mt-4 text-center text-zinc-900 dark:text-zinc-200">
            SAMHSA provides leadership, supports programs and services, and
            devotes resources to helping the United States act on the knowledge
            that behavioral health is essential to health, prevention works,
            treatment is effective, and people recover.
          </p>

          <Link
            href="https://www.verywellmind.com/"
            className="mt-8 text-center underline text-xl md:text-3xl text-slate-400 dark:hover:text-white hover:text-black"
          >
            Verywell Mind
          </Link>
          <p className="mt-4 text-center text-zinc-900 dark:text-zinc-200">
            A mental health and wellness news resource for consumers, provides
            tips for improving and maintaining good mental health. Each article
            is written and reviewed by mental health professionals.
          </p>
          <Link
            href="https://themighty.com/"
            className="mt-8 text-center underline text-xl md:text-3xl text-slate-400 dark:hover:text-white hover:text-black"
          >
            The Mighty
          </Link>
          <p className="mt-4 text-center text-zinc-900 dark:text-zinc-200">
            A community based mental health website which gives members support
            through articles and interactive question and answer components.
          </p>
        </div>
      </main>
    </div>
  );
}
