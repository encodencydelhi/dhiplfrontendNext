// Hands an extracted CV from the job page to the eligibility page, which opens
// in a new tab. A new tab can't read the original File, so:
//  - the extracted text goes through localStorage for a moment: the eligibility
//    tab moves it into its own sessionStorage (so a refresh still works) and
//    deletes the shared copy;
//  - the file itself goes into IndexedDB so the eligibility page can open or
//    download it. Entries older than a day are cleared on the next upload.
// Nothing here ever leaves the visitor's browser.

export interface CvHandoff {
  jobId: string;
  fileName: string;
  fileSize: number;
  text: string;
  uploadedAt?: number; // epoch ms
}

const PREFIX = "dh-cv-";

export function newCvKey() {
  return PREFIX + Math.random().toString(36).slice(2, 10);
}

export function saveCvHandoff(key: string, data: CvHandoff): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function takeCvHandoff(key: string | null): CvHandoff | null {
  if (!key || !key.startsWith(PREFIX)) return null;
  try {
    const raw = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if (!raw) return null;
    sessionStorage.setItem(key, raw);
    localStorage.removeItem(key);
    return JSON.parse(raw) as CvHandoff;
  } catch {
    return null;
  }
}

/* ─── File storage (IndexedDB) ─── */

const DB_NAME = "dh-careers";
const STORE = "cv-files";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

export async function saveCvFile(key: string, file: File): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      // Drop CVs left over from earlier visits
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result;
        if (!cursor) return;
        if (Date.now() - (cursor.value?.savedAt ?? 0) > MAX_AGE_MS) cursor.delete();
        cursor.continue();
      };
      store.put({ file, savedAt: Date.now() }, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Storage unavailable (private mode etc.): the analysis still works, only open/download won't
  }
}

export async function loadCvFile(key: string | null): Promise<File | null> {
  if (!key || !key.startsWith(PREFIX)) return null;
  try {
    const db = await openDb();
    const value = await new Promise<{ file: File } | undefined>((resolve, reject) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return value?.file ?? null;
  } catch {
    return null;
  }
}
