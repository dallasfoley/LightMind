import SettingsForm from "@/components/forms/settings-form";

export default function CustomizationPage() {
  return (
    <main>
      <h1 className="text-4xl md:text-5xl text-center font-bold mb-2 text-zinc-900 dark:text-white">
        Settings
      </h1>
      <SettingsForm />
    </main>
  );
}
