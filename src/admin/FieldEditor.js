import React, { useRef, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import {
  BsArrowUp,
  BsArrowDown,
  BsArrowRight,
  BsArrowLeft,
  BsChevronDown,
  BsTrash,
  BsPlusLg,
  BsImage,
} from "react-icons/bs";
import { imageUrl, thumbUrl } from "../content/images";
import uploadImage from "./uploadImage";
import {
  emptyLike,
  fieldLabel,
  isFixedList,
  isHidden,
  isImageField,
  isMultiline,
  itemTitle,
} from "./fields";

// Every change goes through update(path, fn), where fn receives the *current*
// value at that path. Uploads finish later, so they must not use a stale copy.

// On a phone the editor starts with sections closed, so a page fits on a few screens.
const isPhone = () => window.matchMedia("(max-width: 767.98px)").matches;

// Lists up to this long start open; longer ones (carousel, categories) show a summary per item.
const OPEN_LIST_MAX = 4;

const move = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

// Uploads the chosen files one by one and reports each URL.
const useUploader = (folder) => {
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState();

  const uploadFiles = async (files, onUploaded) => {
    setError(undefined);
    setUploading(files.length);
    for (const file of files) {
      try {
        onUploaded(await uploadImage(file, folder));
      } catch (err) {
        setError(`העלאת ${file.name} נכשלה: ${err.message}`);
      }
      setUploading((count) => count - 1);
    }
  };

  return { uploading, error, uploadFiles };
};

const FilePicker = ({ multiple, onFiles, children }) => {
  const input = useRef();
  return (
    <>
      <button type="button" className="btn-outline-brand admin-btn-sm" onClick={() => input.current.click()}>
        {children}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        hidden
        onChange={(event) => {
          const files = [...event.target.files];
          event.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </>
  );
};

const UploadStatus = ({ uploading, error }) => (
  <>
    {uploading > 0 && (
      <span className="admin-uploading">
        <Spinner animation="border" size="sm" /> מעלה {uploading} תמונות...
      </span>
    )}
    {error && <div className="admin-error">{error}</div>}
  </>
);

const Thumb = ({ path }) => (
  <img
    src={thumbUrl(path)}
    alt=""
    loading="lazy"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = imageUrl(path);
    }}
  />
);

const ImageField = ({ label, value, setValue, folder }) => {
  const { uploading, error, uploadFiles } = useUploader(folder);
  return (
    <div className="admin-field admin-image-field">
      <span className="admin-label">{label}</span>
      <div className="admin-image-row">
        {value ? (
          <a href={imageUrl(value)} target="_blank" rel="noopener noreferrer" title="פתיחה בגודל מלא">
            <Thumb path={value} />
          </a>
        ) : (
          <span className="admin-image-empty"><BsImage /></span>
        )}
        <FilePicker onFiles={(files) => uploadFiles(files.slice(0, 1), setValue)}>
          {value ? "החלפת תמונה" : "העלאת תמונה"}
        </FilePicker>
      </div>
      <UploadStatus uploading={uploading} error={error} />
    </div>
  );
};

// In a grid (right to left) "earlier" is to the right; in a list it is up.
const ItemControls = ({ index, length, onMove, onRemove, grid = false }) => (
  <div className="admin-item-controls">
    <button type="button" onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="הזזה אחורה">
      {grid ? <BsArrowRight /> : <BsArrowUp />}
    </button>
    <button type="button" onClick={() => onMove(index + 1)} disabled={index === length - 1} aria-label="הזזה קדימה">
      {grid ? <BsArrowLeft /> : <BsArrowDown />}
    </button>
    {onRemove && (
      <button type="button" className="danger" onClick={onRemove} aria-label="מחיקה">
        <BsTrash />
      </button>
    )}
  </div>
);

// A titled block that opens and closes when its title is tapped.
const Section = ({ title, className, defaultOpen, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`${className} ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="admin-section-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{title}</span>
        <BsChevronDown className="admin-chevron" aria-hidden="true" />
      </button>
      {open && <div className="admin-section-body">{children}</div>}
    </section>
  );
};

// One item of a list of objects: a summary row (photo, name, details) that opens the fields.
const ListItem = ({ item, index, defaultOpen, controls, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  const photo = [item.path, item.cover, item.image].find((value) => typeof value === "string" && value);
  const details = [
    Array.isArray(item.images) && `${item.images.length} תמונות`,
    item.visible === false && "מוסתר באתר",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={`admin-list-item ${open ? "is-open" : ""}`}>
      <div className="admin-list-item-header">
        <button
          type="button"
          className="admin-item-toggle"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {photo && <Thumb path={photo} />}
          <span className="admin-item-title">
            <strong>{itemTitle(item, index)}</strong>
            {details && <small>{details}</small>}
          </span>
          <BsChevronDown className="admin-chevron" aria-hidden="true" />
        </button>
        {controls}
      </div>
      {open && <div className="admin-list-item-body">{children}</div>}
    </div>
  );
};

// A list of photo URLs (e.g. a gallery): a grid of thumbnails plus multi-upload.
const ImageListField = ({ label, value, updateList, folder }) => {
  const { uploading, error, uploadFiles } = useUploader(folder);
  return (
    <div className="admin-field">
      <span className="admin-label">
        {label} ({value.length})
      </span>
      <div className="admin-image-grid">
        {value.map((path, index) => (
          <div className="admin-image-tile" key={`${index}-${path}`}>
            <Thumb path={path} />
            <ItemControls
              grid
              index={index}
              length={value.length}
              onMove={(to) => updateList((list) => move(list, index, to))}
              onRemove={() => updateList((list) => list.filter((_, i) => i !== index))}
            />
          </div>
        ))}
      </div>
      <FilePicker multiple onFiles={(files) => uploadFiles(files, (url) => updateList((list) => [...list, url]))}>
        <BsPlusLg /> הוספת תמונות
      </FilePicker>
      <UploadStatus uploading={uploading} error={error} />
    </div>
  );
};

const ListField = ({ docKey, path, value, update, folder }) => {
  const { uploading, error, uploadFiles } = useUploader(folder);
  // Items added in this visit open right away, so they can be filled in.
  const initialLength = useRef(value.length).current;
  const updateList = (fn) => update(path, fn);
  const fixed = isFixedList(docKey, path);
  const template = value[0];

  if (typeof template === "string" && isImageField([...path, 0])) {
    return <ImageListField label={fieldLabel(path)} value={value} updateList={updateList} folder={folder} />;
  }

  // Lists of {path, alt} photos (carousel, testimonials) get a multi-upload button.
  const isPhotoList = template && typeof template === "object" && "path" in template;

  const items = value.map((item, index) => {
    const controls = (
      <ItemControls
        index={index}
        length={value.length}
        onMove={(to) => updateList((list) => move(list, index, to))}
        onRemove={fixed ? undefined : () => updateList((list) => list.filter((_, i) => i !== index))}
      />
    );
    const editor = (
      <FieldEditor
        docKey={docKey}
        path={[...path, index]}
        value={item}
        update={update}
        folder={folder}
        hideLabel={typeof item !== "object"}
      />
    );

    // Plain lines (e.g. what a package includes): one compact row each.
    if (typeof item !== "object" || item === null) {
      return (
        <div className="admin-row" key={index}>
          <div className="admin-row-input">{editor}</div>
          {controls}
        </div>
      );
    }

    return (
      <ListItem
        key={index}
        item={item}
        index={index}
        defaultOpen={value.length <= OPEN_LIST_MAX || index >= initialLength}
        controls={controls}
      >
        {editor}
      </ListItem>
    );
  });

  const actions = !fixed && (
    <div className="admin-list-actions">
      {isPhotoList ? (
        <FilePicker
          multiple
          onFiles={(files) =>
            uploadFiles(files, (url) =>
              updateList((list) => [...list, { ...emptyLike(template), path: url }])
            )
          }
        >
          <BsPlusLg /> הוספת תמונות
        </FilePicker>
      ) : (
        <button
          type="button"
          className="btn-outline-brand admin-btn-sm"
          onClick={() => updateList((list) => [...list, template === undefined ? "" : emptyLike(template)])}
        >
          <BsPlusLg /> הוספה
        </button>
      )}
      <UploadStatus uploading={uploading} error={error} />
    </div>
  );

  // A list at the top of the document is a section of its own.
  if (path.length === 1) {
    return (
      <Section title={fieldLabel(path)} className="admin-section admin-list" defaultOpen={!isPhone()}>
        {items}
        {actions}
      </Section>
    );
  }

  return (
    <fieldset className="admin-list">
      <legend>{fieldLabel(path)}</legend>
      {items}
      {actions}
    </fieldset>
  );
};

// Edits any JSON value: objects become sections, arrays become lists.
const FieldEditor = ({ docKey, path = [], value, update, folder, hideLabel = false }) => {
  if (path.length && isHidden(docKey, path)) return null;
  const label = hideLabel ? null : fieldLabel(path);
  const setValue = (newValue) => update(path, () => newValue);

  if (Array.isArray(value)) {
    return <ListField docKey={docKey} path={path} value={value} update={update} folder={folder} />;
  }

  if (value && typeof value === "object") {
    const fields = Object.entries(value).map(([key, inner]) => (
      <FieldEditor
        key={key}
        docKey={docKey}
        path={[...path, key]}
        value={inner}
        update={update}
        folder={folder}
      />
    ));
    // The document itself and list items are plain groups; named objects get a frame.
    if (path.length === 0 || typeof path[path.length - 1] === "number") {
      return <div className="admin-fields">{fields}</div>;
    }
    if (path.length === 1) {
      return (
        <Section title={label} className="admin-section" defaultOpen={!isPhone()}>
          {fields}
        </Section>
      );
    }
    return (
      <fieldset className="admin-group">
        <legend>{label}</legend>
        {fields}
      </fieldset>
    );
  }

  if (typeof value === "boolean") {
    return (
      <Form.Check
        type="switch"
        className="admin-field admin-switch"
        id={`${docKey}-${path.join("-")}`}
        label={label}
        checked={value}
        onChange={(event) => setValue(event.target.checked)}
      />
    );
  }

  if (typeof value === "string" && isImageField(path)) {
    return <ImageField label={label} value={value} setValue={setValue} folder={folder} />;
  }

  const isNumber = typeof value === "number";
  const multiline = !isNumber && isMultiline(path, value);
  return (
    <Form.Group className="admin-field" controlId={`${docKey}-${path.join("-")}`}>
      {label && <Form.Label className="admin-label">{label}</Form.Label>}
      <Form.Control
        as={multiline ? "textarea" : "input"}
        rows={multiline ? Math.min(8, Math.max(3, Math.ceil(String(value).length / 60))) : undefined}
        type={isNumber ? "number" : "text"}
        value={value}
        dir={/^(https?:|\+|\d)/.test(String(value)) ? "ltr" : undefined}
        onChange={(event) => setValue(isNumber ? Number(event.target.value) : event.target.value)}
      />
    </Form.Group>
  );
};

export default FieldEditor;
