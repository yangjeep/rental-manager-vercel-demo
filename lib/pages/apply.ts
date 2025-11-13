import { renderLayout } from "./layout";
import { SITE_TITLE, escapeHtml } from "./shared";

type ApplicationPageOptions = {
  activePath?: string;
};

export function renderApplicationPage({ activePath = "/apply" }: ApplicationPageOptions = {}): string {
  const body = `
    <section class="page-hero">
      <h1>Submit an Application</h1>
      <p>We review every application individually to match residents with the right home. Follow the steps below to get started.</p>
    </section>
    <section class="application-steps">
      <ol>
        <li>
          <strong>Review the property details</strong>
          <span>Collect the listing information for the home you are interested in, including the monthly rent and move-in date.</span>
        </li>
        <li>
          <strong>Gather documentation</strong>
          <span>Recent pay stubs or proof of income, photo identification, and rental history or references help us process quickly.</span>
        </li>
        <li>
          <strong>Email your application package</strong>
          <span>Send everything to <a href="mailto:rentals@example.com">rentals@example.com</a> with the property name in the subject line.</span>
        </li>
      </ol>
      <div class="cta">
        <a class="button" href="mailto:rentals@example.com?subject=${encodeURIComponent("Rental Application Inquiry")}">Email Your Application</a>
        <p class="muted">Prefer a phone call? Reach us at (555) 010-9000 Monday–Friday, 9am–5pm.</p>
      </div>
    </section>
  `;

  return renderLayout({
    title: `Apply · ${escapeHtml(SITE_TITLE)}`,
    body,
    activePath,
  });
}

