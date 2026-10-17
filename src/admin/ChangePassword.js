import React, { useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { BsCheckCircle } from "react-icons/bs";
import supabase from "./supabaseClient";

const MIN_LENGTH = 8;

const translateError = (message) => {
  if (/different from the old password/i.test(message)) return "הסיסמה החדשה זהה לסיסמה הנוכחית";
  if (/at least|weak|short/i.test(message)) return `הסיסמה חלשה מדי. יש לבחור לפחות ${MIN_LENGTH} תווים`;
  return `שינוי הסיסמה נכשל: ${message}`;
};

const ChangePassword = ({ email, onClose }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(undefined);
    if (next.length < MIN_LENGTH) {
      setError(`הסיסמה החדשה צריכה להכיל לפחות ${MIN_LENGTH} תווים`);
      return;
    }
    if (next !== confirm) {
      setError("הסיסמאות החדשות אינן זהות");
      return;
    }

    setBusy(true);
    // Supabase doesn't ask for the old password, so check it by signing in again:
    // someone at an unattended, logged-in computer can't lock the owner out.
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: current });
    if (signInError) {
      setError("הסיסמה הנוכחית שגויה");
      setBusy(false);
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setBusy(false);
    if (updateError) {
      setError(translateError(updateError.message));
      return;
    }
    setDone(true);
  };

  return (
    <Modal show onHide={onClose} centered dir="rtl">
      <Modal.Header closeButton>
        <Modal.Title>שינוי סיסמה</Modal.Title>
      </Modal.Header>
      {done ? (
        <Modal.Body className="text-center py-4">
          <p className="admin-success justify-content-center">
            <BsCheckCircle /> הסיסמה שונתה בהצלחה
          </p>
          <button type="button" className="btn-brand" onClick={onClose}>
            סגירה
          </button>
        </Modal.Body>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="current-password">
              <Form.Label>סיסמה נוכחית</Form.Label>
              <Form.Control
                type="password"
                dir="ltr"
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="new-password">
              <Form.Label>סיסמה חדשה (לפחות {MIN_LENGTH} תווים)</Form.Label>
              <Form.Control
                type="password"
                dir="ltr"
                autoComplete="new-password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="confirm-password">
              <Form.Label>הסיסמה החדשה שוב</Form.Label>
              <Form.Control
                type="password"
                dir="ltr"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </Form.Group>
            {error && <div className="admin-error mt-3">{error}</div>}
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn-outline-brand" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="btn-brand" disabled={busy}>
              {busy ? <Spinner animation="border" size="sm" /> : "שמירת הסיסמה"}
            </button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
};

export default ChangePassword;
