import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Dropdown, Form, Modal, Spinner } from "react-bootstrap";
import {
  BsArrowCounterclockwise,
  BsArrowsCollapse,
  BsArrowsExpand,
  BsBoxArrowLeft,
  BsCamera,
  BsCheck2,
  BsCheckCircle,
  BsEnvelope,
  BsExclamationTriangle,
  BsEye,
  BsEyeSlash,
  BsGrid,
  BsHouseDoor,
  BsImages,
  BsKey,
  BsLayoutTextWindowReverse,
  BsMenuButtonWide,
  BsPersonCircle,
  BsTags,
} from "react-icons/bs";
import supabase from "./supabaseClient";
import FieldEditor, { SectionsCommand } from "./FieldEditor";
import ChangePassword from "./ChangePassword";
import { documentList } from "./fields";
import defaults from "../content/defaults";
import { mergeContent, useSetDocument } from "../content/ContentProvider";
import usePageTitle from "../hooks/usePageTitle";
import "./Admin.css";

// Pages open with every section closed, as after "close all".
const ALL_CLOSED = { open: false };

const updateIn = (value, [head, ...rest], fn) => {
  if (head === undefined) return fn(value);
  const copy = Array.isArray(value) ? [...value] : { ...value };
  copy[head] = updateIn(value[head], rest, fn);
  return copy;
};

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const DOC_ICONS = {
  home: BsHouseDoor,
  categories: BsImages,
  common: BsGrid,
  contact: BsEnvelope,
  header: BsMenuButtonWide,
  footer: BsLayoutTextWindowReverse,
};

const docIcon = (key) => (key.startsWith("prices/") ? BsTags : DOC_ICONS[key] || BsGrid);

// The login, "no access" and "not configured" screens share this card.
const AuthCard = ({ title, subtitle, children }) => (
  <div className="admin-login">
    <div className="admin-login-card">
      <div className="admin-login-brand">
        <span className="admin-brand-mark"><BsCamera /></span>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
);

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <AuthCard title="ניהול האתר" subtitle="התחברו כדי לערוך את התוכן והתמונות באתר">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="admin-email">
          <Form.Label>מייל</Form.Label>
          <Form.Control
            type="email"
            dir="ltr"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="admin-password">
          <Form.Label>סיסמה</Form.Label>
          <div className="admin-password">
            <Form.Control
              type={showPassword ? "text" : "password"}
              dir="ltr"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "הסתרת הסיסמה" : "הצגת הסיסמה"}
              title={showPassword ? "הסתרת הסיסמה" : "הצגת הסיסמה"}
            >
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </button>
          </div>
        </Form.Group>
        {error && (
          <div className="admin-alert mb-3" role="alert">
            <BsExclamationTriangle /> {error}
          </div>
        )}
        <button type="submit" className="btn-brand w-100" disabled={busy}>
          {busy ? <Spinner animation="border" size="sm" /> : "כניסה"}
        </button>
        <Link to="/" className="admin-back">חזרה לאתר</Link>
      </Form>
    </AuthCard>
  );
};

const ConfirmRestore = ({ title, onConfirm, onCancel }) => (
  <Modal show onHide={onCancel} centered dir="rtl">
    <Modal.Header closeButton>
      <Modal.Title>שחזור לתוכן המקורי</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p className="mb-0">
        להחזיר את <strong>{title}</strong> לתוכן המקורי? כל השינויים שנשמרו בעמוד הזה יימחקו,
        ואי אפשר לבטל את הפעולה.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <button type="button" className="btn-outline-brand" onClick={onCancel}>
        ביטול
      </button>
      <button type="button" className="btn-danger-brand" onClick={onConfirm}>
        <BsArrowCounterclockwise /> שחזור
      </button>
    </Modal.Footer>
  </Modal>
);

const Editor = ({ user }) => {
  const setDocument = useSetDocument();
  const [saved, setSaved] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [loadError, setLoadError] = useState();
  const [status, setStatus] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);
  const [confirmingRestore, setConfirmingRestore] = useState(false);
  const [sectionsCommand, setSectionsCommand] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentKey = searchParams.get("doc") || "home";
  // Each time another page is shown (menu, back/forward) it opens closed, as
  // after "close all". Reset during render so the page never flashes open.
  const [commandKey, setCommandKey] = useState(currentKey);
  if (commandKey !== currentKey) {
    setCommandKey(currentKey);
    setSectionsCommand(null);
  }
  const saveRef = useRef();

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

  // Ctrl+S (Cmd+S on a Mac) saves the page being edited. KeyS also matches a Hebrew keyboard.
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && (event.code === "KeyS" || event.key === "s")) {
        event.preventDefault();
        saveRef.current?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // The success message is a toast that hides itself.
  useEffect(() => {
    if (!status.message) return undefined;
    const timer = setTimeout(() => setStatus({}), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  const update = useCallback(
    (path, fn) => {
      setDrafts((current) => ({ ...current, [currentKey]: updateIn(current[currentKey], path, fn) }));
      setStatus((value) => (value.error ? {} : value));
    },
    [currentKey]
  );

  if (loadError) {
    return (
      <div className="admin-loading">
        <div className="admin-alert" role="alert">
          <BsExclamationTriangle /> טעינת התוכן נכשלה: {loadError}
        </div>
      </div>
    );
  }
  if (!drafts) {
    return (
      <div className="admin-loading">
        <Spinner animation="border" />
        <span>טוען את תוכן האתר...</span>
      </div>
    );
  }

  const docs = documentList(drafts.categories);
  const current = docs.find((doc) => doc.key === currentKey) || docs[0];
  const draft = drafts[current.key];
  const dirty = isDirty(current.key);
  const otherDirty = docs.filter((doc) => doc.key !== current.key && isDirty(doc.key)).length;
  const CurrentIcon = docIcon(current.key);

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
  saveRef.current = dirty && !status.busy ? save : undefined;

  const discard = () => {
    setDrafts((value) => ({ ...value, [current.key]: saved[current.key] }));
    setStatus({});
  };

  const restoreDefault = async () => {
    setConfirmingRestore(false);
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

  return (
    <div className="admin">
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-brand-mark"><BsCamera /></span>
          <strong>ניהול האתר</strong>
        </div>
        <div className="admin-topbar-actions">
          <Dropdown align="start">
            <Dropdown.Toggle as="button" type="button" className="admin-ghost admin-account" aria-label="חשבון">
              <BsPersonCircle />
              <span className="admin-hide-phone admin-account-email" dir="ltr">{user.email}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="admin-menu">
              <Dropdown.Header dir="ltr" className="admin-show-phone">{user.email}</Dropdown.Header>
              <Dropdown.Item as="button" type="button" onClick={() => setChangingPassword(true)}>
                <BsKey /> שינוי סיסמה
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as="button" type="button" onClick={() => supabase.auth.signOut()}>
                <BsBoxArrowLeft /> יציאה
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      {changingPassword && (
        <ChangePassword email={user.email} onClose={() => setChangingPassword(false)} />
      )}
      {confirmingRestore && (
        <ConfirmRestore
          title={current.title}
          onConfirm={restoreDefault}
          onCancel={() => setConfirmingRestore(false)}
        />
      )}

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
          <div className="admin-nav-card">
            <ul className="admin-nav-list">
              {docs.map((doc, index) => {
                const Icon = docIcon(doc.key);
                return (
                  <React.Fragment key={doc.key}>
                    {doc.group && doc.group !== docs[index - 1]?.group && (
                      <li className="admin-nav-group">{doc.group}</li>
                    )}
                    <li>
                      <button
                        type="button"
                        className={`${doc.key === current.key ? "active" : ""} ${doc.group ? "is-sub" : ""}`}
                        aria-current={doc.key === current.key ? "page" : undefined}
                        onClick={() => selectDoc(doc.key)}
                      >
                        {!doc.group && <Icon className="admin-nav-icon" aria-hidden="true" />}
                        <span className="admin-nav-title">{doc.group ? doc.title.replace(/^מחירון /, "") : doc.title}</span>
                        {isDirty(doc.key) && <span className="admin-dirty-dot" title="שינויים שלא נשמרו" />}
                      </button>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </nav>

        <section className="admin-main">
          <div className="admin-page-header">
            <span className="admin-page-icon"><CurrentIcon /></span>
            <div className="admin-page-heading">
              <h1>{current.title}</h1>
              {current.description && <p>{current.description}</p>}
            </div>
          </div>

          <div className="admin-toolbar">
            {current.path && (
              <Link to={current.path} target="_blank" className="admin-ghost" title="העמוד באתר, כפי שנשמר">
                <BsEye /> צפייה באתר
              </Link>
            )}
            <button type="button" className="admin-ghost" onClick={() => setSectionsCommand({ open: true })}>
              <BsArrowsExpand /> פתיחת הכל
            </button>
            <button type="button" className="admin-ghost" onClick={() => setSectionsCommand({ open: false })}>
              <BsArrowsCollapse /> סגירת הכל
            </button>
            <button
              type="button"
              className="admin-ghost danger admin-toolbar-end"
              onClick={() => setConfirmingRestore(true)}
              disabled={status.busy}
            >
              <BsArrowCounterclockwise /> שחזור לתוכן המקורי
            </button>
          </div>

          <SectionsCommand.Provider value={sectionsCommand || ALL_CLOSED}>
            <FieldEditor
              key={current.key}
              docKey={current.key}
              value={draft}
              update={update}
              folder={current.key}
            />
          </SectionsCommand.Provider>

          <div className={`admin-savebar ${dirty ? "is-dirty" : ""}`}>
            <div className="admin-savebar-status" aria-live="polite">
              {status.error ? (
                <span className="admin-error"><BsExclamationTriangle /> {status.error}</span>
              ) : dirty ? (
                <span className="admin-hint"><span className="admin-dirty-dot" /> יש שינויים שלא נשמרו</span>
              ) : (
                <span className="admin-saved"><BsCheck2 /> הכל שמור</span>
              )}
              {otherDirty > 0 && (
                <small>
                  {otherDirty === 1
                    ? "יש שינויים שלא נשמרו גם בעמוד נוסף"
                    : `יש שינויים שלא נשמרו גם ב-${otherDirty} עמודים נוספים`}
                </small>
              )}
            </div>
            <div className="admin-savebar-actions">
              <button type="button" className="btn-outline-brand" onClick={discard} disabled={!dirty || status.busy}>
                ביטול שינויים
              </button>
              <button
                type="button"
                className="btn-brand"
                onClick={save}
                disabled={!dirty || status.busy}
                title="Ctrl+S"
              >
                {status.busy ? <Spinner animation="border" size="sm" /> : "שמירה"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {status.message && (
        <div className="admin-toast" role="status">
          <BsCheckCircle /> {status.message}
        </div>
      )}
    </div>
  );
};

const AdminScreen = () => {
  usePageTitle("ניהול האתר");
  const [session, setSession] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [adminCheckError, setAdminCheckError] = useState();

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;
  useEffect(() => {
    setIsAdmin(undefined);
    setAdminCheckError(undefined);
    if (!userId) return;
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setAdminCheckError(error.message);
        setIsAdmin(!error && Boolean(data));
      });
  }, [userId]);

  if (!supabase) {
    return (
      <AuthCard title="ניהול האתר">
        <p>החיבור ל-Supabase עדיין לא הוגדר. יש להוסיף את הפרטים לקובץ <code>.env</code> (ראו <code>.env.example</code>) ולבנות את האתר מחדש.</p>
      </AuthCard>
    );
  }

  if (session === undefined || (session && isAdmin === undefined)) {
    return <div className="admin-loading"><Spinner animation="border" /></div>;
  }

  if (!session) return <LoginForm />;

  if (!isAdmin) {
    return (
      <AuthCard title="אין הרשאה">
        <p>
          המשתמש <span dir="ltr">{session.user.email}</span> מחובר, אבל אינו מורשה לערוך את האתר.
        </p>
        {adminCheckError ? (
          <div className="admin-alert mb-3" role="alert">
            <BsExclamationTriangle /> בדיקת ההרשאה נכשלה: <span dir="ltr">{adminCheckError}</span>
          </div>
        ) : (
          <p className="admin-muted">
            המשתמש לא נמצא בטבלת המנהלים (admins) ב-Supabase.
          </p>
        )}
        <button type="button" className="btn-outline-brand w-100" onClick={() => supabase.auth.signOut()}>
          יציאה
        </button>
      </AuthCard>
    );
  }

  return <Editor user={session.user} />;
};

export default AdminScreen;
