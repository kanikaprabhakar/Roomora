import React from "react";

export default function AuthLayout({
  title,
  subtitle,
  form,
  footerTag
}) {
  return (
    <main className="auth-scene">
      <div className="orb orb-large" aria-hidden="true" />
      <div className="orb orb-medium" aria-hidden="true" />
      <div className="orb orb-small" aria-hidden="true" />

      <section className="auth-card">
        <div className="brand">
          <img src="/logo.png" alt="Roomora logo" className="brand-logo" />
          <div className="brand-copy">
            <h1>ROOMORA</h1>
            <p>Find your space. Share your world.</p>
          </div>
        </div>

        <div className="auth-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {form}

        <span className="footer-tag">{footerTag}</span>
      </section>
    </main>
  );
}
