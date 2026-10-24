"use client";

import { fontVars } from "@/components/redesign/fonts";
import { FlowMark } from "@/components/loading/FlowMark";
import styles from "@/components/loading/loading.module.css";

/* Compact branded loader for pages without the app shell (login, register,
   public tracking). Inside the app, screens use the skeletons in
   components/loading/Skeleton.tsx instead. */
export function LoadingScreen({ message }: { message: string }) {
  return (
    <div className={`${styles.root} ${fontVars} ${styles.soft}`} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.softIn}>
        <FlowMark className={styles.softMark} title="" />
        <p className={styles.softMsg}>{message}</p>
        <div className={styles.softBar} aria-hidden="true">
          <i />
        </div>
      </div>
    </div>
  );
}
