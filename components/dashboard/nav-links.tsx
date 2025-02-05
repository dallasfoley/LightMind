"use client";

import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";

export default function NavLinks() {
  const router = useRouter();
  const links = [
    { title: "Daily check in", link: "check-in" },
    { title: "Journal", link: "journal" },
    { title: "Goals", link: "goals" },
    { title: "Reminders", link: "reminders" },
    { title: "Customization", link: "customization" },
  ];
  return (
    <>
      {links.map((link, id) => (
        <button key={id} onClick={() => router.push(`/dashboard/${link.link}`)}>
          <Card
            className="bg-purple-300 flex items-center justify-center"
            key={id}
          >
            <CardHeader className="flex flex-row items-center justify-between p-2 h-full w-full border-3">
              <CardTitle className="font-medium">{link.title}</CardTitle>
              <ArrowRight />
            </CardHeader>
          </Card>
        </button>
      ))}
    </>
  );
}
