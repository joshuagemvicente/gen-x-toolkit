"use client";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useId, useState } from "react";
import { GREETING_NAME_MAX_LENGTH } from "@repo/contracts";
import { apiClient } from "../lib/api-client";
import { attempt, type Result } from "../lib/result";
import styles from "./page.module.css";

/**
 * Client component: the browser calls the API directly, which is why the API
 * allows this origin through CORS.
 */
export function GreetingPanel() {
  const router = useRouter();
  const inputId = useId();
  const [feedback, setFeedback] = useState<Result<string> | null>(null);

  async function greet(formData: FormData): Promise<void> {
    const result = await attempt(() =>
      apiClient.greet(String(formData.get("name") ?? "")),
    );

    setFeedback(result.ok ? { ok: true, data: result.data.message } : result);

    if (result.ok) {
      router.refresh();
    }
  }

  return (
    <form className={styles.form} action={greet}>
      <label className={styles.label} htmlFor={inputId}>
        Name
      </label>
      <div className={styles.field}>
        <input
          id={inputId}
          name="name"
          className={styles.input}
          maxLength={GREETING_NAME_MAX_LENGTH}
          placeholder="Ada"
          autoComplete="off"
          required
        />
        <SubmitButton />
      </div>
      {feedback ? (
        <p className={feedback.ok ? styles.success : styles.error} role="status">
          {feedback.ok ? feedback.data : feedback.message}
        </p>
      ) : null}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.button} type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send"}
    </button>
  );
}
