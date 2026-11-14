import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Privacy",
  description: "How information is used by InterviewHub AI.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Privacy</h1>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Account and learning information</h2>
        <p className="leading-7 text-muted-foreground">
          InterviewHub AI stores account details, profile information, learning progress,
          submissions and content you create to provide its features. Passwords are hashed, not
          stored as plain text.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">AI tools</h2>
        <p className="leading-7 text-muted-foreground">
          Questions, interview answers and resume text submitted to AI tools are processed by the
          configured AI provider. Conversations, interview answers, reviews and study plans may be
          saved to your account. Do not submit passwords, financial information or sensitive
          personal identifiers.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Public content</h2>
        <p className="leading-7 text-muted-foreground">
          Published discussions and interview experiences can be viewed by other visitors. Avoid
          posting information you do not want to make public.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Cookies and device preferences</h2>
        <p className="leading-7 text-muted-foreground">
          Authentication cookies maintain your session. Your selected theme is stored on your
          device. Enabled analytics services may process usage information.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Managing information</h2>
        <p className="leading-7 text-muted-foreground">
          You can update your name and bio in account settings. Automated account deletion and data
          export are not currently available.
        </p>
      </section>
    </article>
  );
}
