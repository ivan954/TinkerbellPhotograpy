import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Form, Spinner } from "react-bootstrap";
import { BsBoxArrowUpLeft, BsCheckCircle } from "react-icons/bs";
import supabase from "./supabaseClient";
import FieldEditor from "./FieldEditor";
import { documentList } from "./fields";
import defaults from "../content/defaults";
import { mergeContent, useSetDocument } from "../content/ContentProvider";
import usePageTitle from "../hooks/usePageTitle";
import "./Admin.css";

const updateIn = (value, [head, ...rest], fn) => {
  if (head === undefined) return fn(value);
  const copy = Array.isArray(value) ? [...value] : { ...value };
  copy[head] = updateIn(value[head], rest, fn);
  return copy;
};

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "המייל או הסיסמה שגויים"
          : `ההתחברות נכשלה: ${signInError.message}`
      );
    }
    setBusy(false);
  };

  return (
    <div className="admin-login">
      <Form onSubmit={handleSubmit} className="admin-login-card">
        <h1>ניהול האתר</h1>
        <Form.Group className="mb-3" controlId="admin-email">
          <Form.Label>מייל</Form.Label>
          <Form.Control
            type="email"
            dir="ltr"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="admin-password">
          <Form.Label>סיסמה</Form.Label>
          <Form.Control
            type="password"
            dir="ltr"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        {error && <div className="admin-error mb-3">{error}</div>}
        <button type="submit" className="btn-brand w-100" disabled={busy}>
          {busy ? <Spinner animation="border" size="sm" /> : "כניסה"}
        </button>
        <Link to="/" className="admin-back">חזרה לאתר</Link>
      </Form>
    </div>
  );
};

const Editor = ({ user }) => {
  const setDocument = useSetDocument();
  const [saved, setSaved] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [loadError, setLoadError] = useState();
  const [status, setStatus] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const currentKey = searchParams.get("doc") || "home";

  useEffect(() => {
    supabase
      .from("site_content")
      .select("key,data")
      .then(({ data, error }) => {
        if (error) {
          setLoadError(error.message);
          return;
        }
        const rows = Object.fromEntries(data.map((row) => [row.key, row.data]));
        const content = Object.fromEntries(
          Object.entries(defaults).map(([key, value]) => [key, mergeContent(value, rows[key])])
        );
        setSaved(content);
        setDrafts(content);
      });
  }, []);

  const isDirty = useCallback((key) => saved && !same(saved[key], drafts[key]), [saved, drafts]);
  const anyDirty = useMemo(
    () => Boolean(saved) && Object.keys(defaults).some((key) => isDirty(key)),
    [saved, isDirty]
  );

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!anyDirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);

  const update = useCallback(
    (path, fn) => {
      setDrafts((current) => ({ ...current, [currentKey]: updateIn(current[currentKey], path, fn) }));
      setStatus({});
    },
    [currentKey]
  );

  if (loadError) return <div className="admin-error m-4">טעינת התוכן נכשלה: {loadError}</div>;
  if (!drafts) return <div className="admin-loading"><Spinner animation="border" /></div>;

  const docs = documentList(drafts.categories);
  const current = docs.find((doc) => doc.key === currentKey) || docs[0];
  const draft = drafts[current.key];

  const save = async () => {
    setStatus({ busy: true });
    const { error } = await supabase.from("site_content").upsert({ key: current.key, data: draft });
    if (error) {
      setStatus({ error: `השמירה נכשלה: ${error.message}` });
      return;
    }
    setSaved((value) => ({ ...value, [current.key]: draft }));
    setDocument(current.key, draft);
    setStatus({ message: "השינויים נשמרו ומופיעים באתר" });
  };

  const discard = () => {
    setDrafts((value) => ({ ...value, [current.key]: saved[current.key] }));
    setStatus({});
  };

  const restoreDefault = async () => {
    if (!window.confirm(`להחזיר את "${current.title}" לתוכן המקורי? כל השינויים שנשמרו בעמוד הזה יימחקו.`)) {
      return;
    }
    setStatus({ busy: true });
    const { error } = await supabase.from("site_content").delete().eq("key", current.key);
    if (error) {
      setStatus({ error: `השחזור נכשל: ${error.message}` });
      return;
    }
    const original = defaults[current.key];
    setSaved((value) => ({ ...value, [current.key]: original }));
    setDrafts((value) => ({ ...value, [current.key]: original }));
    setDocument(current.key, original);
    setStatus({ message: "העמוד הוחזר לתוכן המקורי" });
  };

  const selectDoc = (key) => {
    setSearchParams({ doc: key });
    setStatus({});
    window.scrollTo({ top: 0 });
  };

  const dirty = isDirty(current.key);

  return (
    <div className="admin">
      <header className="admin-topbar">
        <strong>ניהול האתר</strong>
        <div className="admin-topbar-actions">
          <span className="admin-user" dir="ltr">{user.email}</span>
          <Link to="/" target="_blank" className="admin-link">
            לאתר <BsBoxArrowUpLeft />
          </Link>
          <button type="button" className="admin-link" onClick={() => supabase.auth.signOut()}>
            יציאה
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className="admin-nav" aria-label="עמודים">
          <Form.Select
            className="admin-nav-select"
            value={current.key}
            onChange={(event) => selectDoc(event.target.value)}
            aria-label="בחירת עמוד לעריכה"
          >
            {docs.map((doc) => (
              <option key={doc.key} value={doc.key}>
                {doc.title}
                {isDirty(doc.key) ? " •" : ""}
              </option>
            ))}
          </Form.Select>
          <ul className="admin-nav-list">
            {docs.map((doc, index) => (
              <React.Fragment key={doc.key}>
                {doc.group && doc.group !== docs[index - 1]?.group && (
                  <li className="admin-nav-group">{doc.group}</li>
                )}
                <li>
                  <button
                    type="button"
                    className={doc.key === current.key ? "active" : ""}
                    onClick={() => selectDoc(doc.key)}
                  >
                    {doc.title}
                    {isDirty(doc.key) && <span className="admin-dirty-dot" title="שינויים שלא נשמרו" />}
                  </button>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </nav>

        <section className="admin-main">
          <div className="admin-main-header">
            <h1>{current.title}</h1>
            <button type="button" className="admin-link" onClick={restoreDefault}>
              שחזור לתוכן המקורי
            </button>
          </div>

          <FieldEditor
            key={current.key}
            docKey={current.key}
            value={draft}
            update={update}
            folder={current.key}
          />

          <div className="admin-savebar">
            <button type="button" className="btn-brand" onClick={save} disabled={!dirty || status.busy}>
              {status.busy ? <Spinner animation="border" size="sm" /> : "שמירה"}
            </button>
            <button type="button" className="btn-outline-brand" onClick={discard} disabled={!dirty || status.busy}>
              ביטול שינויים
            </button>
            {status.message && (
              <span className="admin-success">
                <BsCheckCircle /> {status.message}
              </span>
            )}
            {status.error && <span className="admin-error">{status.error}</span>}
            {!status.message && !status.error && dirty && (
              <span className="admin-hint">יש שינויים שלא נשמרו</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const AdminScreen = () => {
  usePageTitle("ניהול האתר");
  const [session, setSession] = useState();
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;
  useEffect(() => {
    setIsAdmin(undefined);
    if (!userId) return;
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => setIsAdmin(!error && Boolean(data)));
  }, [userId]);

  if (!supabase) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h1>ניהול האתר</h1>
          <p>החיבור ל-Supabase עדיין לא הוגדר. יש להוסיף את הפרטים לקובץ <code>.env</code> (ראו <code>.env.example</code>) ולבנות את האתר מחדש.</p>
        </div>
      </div>
    );
  }

  if (session === undefined || (session && isAdmin === undefined)) {
    return <div className="admin-loading"><Spinner animation="border" /></div>;
  }

  if (!session) return <LoginForm />;

  if (!isAdmin) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h1>אין הרשאה</h1>
          <p>
            המשתמש <span dir="ltr">{session.user.email}</span> מחובר, אבל אינו מורשה לערוך את האתר.
          </p>
          <button type="button" className="btn-outline-brand" onClick={() => supabase.auth.signOut()}>
            יציאה
          </button>
        </div>
      </div>
    );
  }

  return <Editor user={session.user} />;
};

export default AdminScreen;
