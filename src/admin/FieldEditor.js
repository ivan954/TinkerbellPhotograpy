import React, { createContext, useContext, useEffect, useRef, useState } from "react";
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
  BsCloudUpload,
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
  listTemplate,
} from "./fields";

// Every change goes through update(path, fn), where fn receives the *current*
// value at that path. Uploads finish later, so they must not use a stale copy.

// On a phone the editor starts with sections closed, so a page fits on a few screens.
const isPhone = () => window.matchMedia("(max-width: 767.98px)").matches;

// Lists up to this long start open; longer ones (carousel, categories) show a summary per item.
const OPEN_LIST_MAX = 4;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// "Open all" / "close all" in the page toolbar: each click provides a new {open}
// object, and every section follows it.
export const SectionsCommand = createContext(null);

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

// Lets photos be dragged from the computer onto an image field or a gallery.
// A drop is handled by the innermost zone, so a photo dropped on one carousel
// item replaces that item instead of being added to the list.
const useDropFiles = (onFiles) => {
  const [dragging, setDragging] = useState(false);
  const hasFiles = (event) => [...(event.dataTransfer?.types || [])].includes("Files");

  const dropProps = {
    onDragOver: (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      event.stopPropagation();
      setDragging(true);
    },
    onDragLeave: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
    },
    onDrop: (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      event.stopPropagation();
      setDragging(false);
      const files = [...event.dataTransfer.files].filter((file) => ACCEPTED_TYPES.includes(file.type));
      if (files.length) onFiles(files);
    },
  };

  return { dragging, dropProps };
};

const FilePicker = ({ multiple, onFiles, className = "btn-outline-brand admin-btn-sm", children }) => {
  const input = useRef();
  return (
    <>
      <button type="button" className={className} onClick={() => input.current.click()}>
        {children}
      </button>
      <input
        ref={input}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
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
  const replace = (files) => uploadFiles(files.slice(0, 1), setValue);
  const { dragging, dropProps } = useDropFiles(replace);
  return (
    <div className="admin-field admin-image-field">
      <span className="admin-label">{label}</span>
      <div className={`admin-image-row admin-drop ${dragging ? "is-dragging" : ""}`} {...dropProps}>
        {value ? (
          <a href={imageUrl(value)} target="_blank" rel="noopener noreferrer" title="פתיחה בגודל מלא">
            <Thumb path={value} />
          </a>
        ) : (
          <span className="admin-image-empty"><BsImage /></span>
        )}
        <div className="admin-image-actions">
          <FilePicker onFiles={replace}>
            {value ? "החלפת תמונה" : "העלאת תמונה"}
          </FilePicker>
          <small className="admin-drop-hint">או גררו תמונה לכאן</small>
        </div>
      </div>
      <UploadStatus uploading={uploading} error={error} />
    </div>
  );
};

// In a grid (right to left) "earlier" is to the right; in a list it is up.
const ItemControls = ({ index, length, onMove, onRemove, grid = false }) => (
  <div className="admin-item-controls">
    <button
      type="button"
      onClick={() => onMove(index - 1)}
      disabled={index === 0}
      aria-label="הזזה אחורה"
      title={grid ? "הזזה ימינה" : "הזזה למעלה"}
    >
      {grid ? <BsArrowRight /> : <BsArrowUp />}
    </button>
    <button
      type="button"
      onClick={() => onMove(index + 1)}
      disabled={index === length - 1}
      aria-label="הזזה קדימה"
      title={grid ? "הזזה שמאלה" : "הזזה למטה"}
    >
      {grid ? <BsArrowLeft /> : <BsArrowDown />}
    </button>
    {onRemove && (
      <button type="button" className="danger" onClick={onRemove} aria-label="מחיקה" title="מחיקה">
        <BsTrash />
      </button>
    )}
  </div>
);

// A titled block that opens and closes when its title is tapped.
const Section = ({ title, count, className, defaultOpen, children }) => {
  const command = useContext(SectionsCommand);
  const [open, setOpen] = useState(command ? command.open : defaultOpen);
  useEffect(() => {
    if (command) setOpen(command.open);
  }, [command]);

  return (
    <section className={`${className} ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="admin-section-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="admin-section-title">
          {title}
          {count !== undefined && <span className="admin-count">{count}</span>}
        </span>
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
    <div className={`admin-list-item ${open ? "is-open" : ""} ${item.visible === false ? "is-hidden-item" : ""}`}>
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
  const add = (files) => uploadFiles(files, (url) => updateList((list) => [...list, url]));
  const { dragging, dropProps } = useDropFiles(add);
  return (
    <div className="admin-field">
      <span className="admin-label">
        {label} <span className="admin-count">{value.length}</span>
      </span>
      <div className={`admin-image-grid admin-drop ${dragging ? "is-dragging" : ""}`} {...dropProps}>
        {value.map((path, index) => (
          <div className="admin-image-tile" key={`${index}-${path}`}>
            <span className="admin-tile-index">{index + 1}</span>
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
        {Array.from({ length: uploading }, (_, index) => (
          <div className="admin-image-tile is-uploading" key={`uploading-${index}`}>
            <Spinner animation="border" size="sm" />
          </div>
        ))}
        <FilePicker multiple className="admin-image-add" onFiles={add}>
          <BsCloudUpload />
          <span>הוספת תמונות</span>
          <small className="admin-drop-hint">או גררו לכאן</small>
        </FilePicker>
      </div>
      {error && <div className="admin-error">{error}</div>}
    </div>
  );
};

const ListField = ({ docKey, path, value, update, folder }) => {
  const { uploading, error, uploadFiles } = useUploader(folder);
  // Items added in this visit open right away, so they can be filled in.
  const initialLength = useRef(value.length).current;
  const updateList = (fn) => update(path, fn);
  const fixed = isFixedList(docKey, path);
  const template = value[0] ?? listTemplate(docKey, path);
  const addPhotos = (files) =>
    uploadFiles(files, (url) => updateList((list) => [...list, { ...emptyLike(template), path: url }]));
  const { dragging, dropProps } = useDropFiles(addPhotos);

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
        <>
          <FilePicker multiple onFiles={addPhotos}>
            <BsPlusLg /> הוספת תמונות
          </FilePicker>
          <small className="admin-drop-hint">או גררו תמונות לכאן</small>
        </>
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

  // Photo lists also take photos dropped anywhere on them.
  const body = isPhotoList && !fixed ? (
    <div className={`admin-drop ${dragging ? "is-dragging" : ""}`} {...dropProps}>
      {items}
      {actions}
    </div>
  ) : (
    <>
      {items}
      {actions}
    </>
  );

  // A list at the top of the document is a section of its own.
  if (path.length === 1) {
    return (
      <Section
        title={fieldLabel(path)}
        count={value.length}
        className="admin-section admin-list"
        defaultOpen={!isPhone()}
      >
        {body}
      </Section>
    );
  }

  return (
    <fieldset className="admin-list">
      <legend>
        {fieldLabel(path)} <span className="admin-count">{value.length}</span>
      </legend>
      {body}
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
