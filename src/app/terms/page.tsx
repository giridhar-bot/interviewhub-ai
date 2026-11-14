import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Terms of Use",
  description: "Terms for using InterviewHub AI.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Using the platform</h2>
        <p className="leading-7 text-muted-foreground">
          InterviewHub AI provides educational material and interview preparation tools. Keep your
          account credentials private and use the platform lawfully. Do not spam, harass other users
          or attempt to disrupt the service.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Your contributions</h2>
        <p className="leading-7 text-muted-foreground">
          Only submit content you have the right to share. Do not publish confidential interview
          material, personal information belonging to others or content that infringes another
          person&apos;s rights. Published contributions are visible to other visitors.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">AI and educational guidance</h2>
        <p className="leading-7 text-muted-foreground">
          AI responses can be inaccurate. Review generated answers and recommendations before
          relying on them. Practice results and AI-estimated resume scores do not guarantee a job
          offer or acceptance by an employer&apos;s ATS.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Availability</h2>
        <p className="leading-7 text-muted-foreground">
          Features depend on configured services and may be subject to usage limits. Paid checkout
          and subscription upgrades are not currently available. Advertised future plans do not
          activate a paid subscription.
        </p>
      </section>
    </article>
  );
}
