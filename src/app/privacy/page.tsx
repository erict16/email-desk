import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy · Email Desk",
  description: "Privacy policy for Email Desk",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy">
      <p>
        Email Desk is a personal, static follow-up board. It is published as a
        simple website so the owner can open a clean checklist on any device.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        What this site is
      </h2>
      <p>
        The board content is written by the site owner and stored as files in
        the project repository. There is no user account system, no login, and
        no comment or form submission on this site.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        Data we collect
      </h2>
      <p>
        This site does <strong className="font-medium text-[var(--fg)]">not</strong>{" "}
        intentionally collect personal data from visitors. We do not run our own
        analytics, advertising pixels, or user tracking scripts.
      </p>
      <p>
        Like most websites, the hosting provider (for example GitHub Pages) may
        process standard technical logs such as IP address, browser type, and
        request time for security and reliability. That processing is governed
        by the host&apos;s own policies.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        Cookies
      </h2>
      <p>
        Email Desk does not set first-party cookies for tracking. Your browser
        may still store ordinary cache files for images and scripts so the site
        loads faster.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        Board content
      </h2>
      <p>
        Items shown on the board may refer to work threads the owner is
        tracking. Visitors should not treat the board as a private inbox or as
        confidential storage. Do not send personal data to this site expecting
        confidentiality through the website itself.
      </p>

      <h2 className="pt-2 text-[15px] font-semibold text-[var(--fg)]">
        Contact
      </h2>
      <p>
        Questions about this policy can be directed to the site owner through
        the usual private channels you already use with them. This public site
        is not a support portal.
      </p>
    </LegalShell>
  );
}
