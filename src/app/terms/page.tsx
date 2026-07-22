import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Terms · Email Desk",
  description: "Terms of use for Email Desk",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms">
      <p>
        By opening Email Desk you agree to these short terms. The site is a
        personal tool, kept intentionally simple.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        Purpose
      </h2>
      <p>
        Email Desk displays a follow-up checklist maintained by its owner. It is
        provided as-is for convenience, not as a commercial product or a shared
        workplace system of record.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        No warranty
      </h2>
      <p>
        The board may be incomplete, outdated, or incorrect. It is not legal,
        financial, or professional advice. Use it at your own judgment. The
        owner is not liable for decisions made solely from this page.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        Acceptable use
      </h2>
      <p>
        Do not scrape, mirror, or republish the board in a way that misrepresents
        its source or purpose. Do not attempt to disrupt hosting or abuse any
        related infrastructure.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        Intellectual property
      </h2>
      <p>
        Site design, branding, and original text belong to the site owner unless
        otherwise noted. Third-party names that appear in board items remain the
        property of their respective owners and are shown only for operational
        reference.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        Changes
      </h2>
      <p>
        These terms may be updated from time to time. The “Last updated” date at
        the top of the page will change when that happens. Continued use of the
        site after an update means you accept the revised terms.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        Governing sense
      </h2>
      <p>
        This is a lightweight personal site. If a formal dispute ever arises, the
        laws of the owner&apos;s place of business will guide how it is handled,
        without creating extra rights beyond applicable mandatory law.
      </p>
    </LegalShell>
  );
}
