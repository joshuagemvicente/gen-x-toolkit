import { apiClient } from "../lib/api-client";
import { attempt } from "../lib/result";
import { GreetingPanel } from "./greeting-panel";
import styles from "./page.module.css";

export default async function Home() {
  const [health, history] = await Promise.all([
    attempt(apiClient.getHealth),
    attempt(apiClient.getRecentGreetings),
  ]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>gen-x-toolkit</h1>
          <p className={styles.subtitle}>
            A Next.js frontend and a NestJS API that share one contract package.
          </p>
        </header>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>API health</h2>
          {health.ok ? (
            <dl className={styles.facts}>
              <div>
                <dt>Service</dt>
                <dd>{health.data.service}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{health.data.version}</dd>
              </div>
              <div>
                <dt>Uptime</dt>
                <dd>{health.data.uptimeSeconds}s</dd>
              </div>
            </dl>
          ) : (
            <p className={styles.error}>
              API unreachable — {health.message}. Start it with{" "}
              <code>npm run dev</code>.
            </p>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Send a greeting</h2>
          <GreetingPanel />
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Recent greetings</h2>
          {history.ok ? (
            history.data.items.length > 0 ? (
              <ol className={styles.list}>
                {history.data.items.map((greeting) => (
                  <li key={greeting.greetedAt}>
                    <span>{greeting.message}</span>
                    <span className={styles.time}>
                      {new Date(greeting.greetedAt).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.muted}>Nothing recorded yet.</p>
            )
          ) : (
            <p className={styles.error}>
              History unavailable — {history.message}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
