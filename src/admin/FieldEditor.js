import React, { useRef, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { BsArrowUp, BsArrowDown, BsTrash, BsPlusLg, BsImage } from "react-icons/bs";
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

const ItemControls = ({ index, length, onMove, onRemove }) => (
  <div className="admin-item-controls">
    <button type="button" onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="הזזה אחורה">
      <BsArrowUp />
    </button>
    <button type="button" onClick={() => onMove(index + 1)} disabled={index === length - 1} aria-label="הזזה קדימה">
      <BsArrowDown />
    </button>
    {onRemove && (
      <button type="button" className="danger" onClick={onRemove} aria-label="מחיקה">
        <BsTrash />
      </button>
    )}
  </div>
);

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
  const updateList = (fn) => update(path, fn);
  const fixed = isFixedList(docKey, path);
  const template = value[0];

  if (typeof template === "string" && isImageField([...path, 0])) {
    return <ImageListField label={fieldLabel(path)} value={value} updateList={updateList} folder={folder} />;
  }

  // Lists of {path, alt} photos (carousel, testimonials) get a multi-upload button.
  const isPhotoList = template && typeof template === "object" && "path" in template;

  return (
    <fieldset className="admin-list">
      <legend>{fieldLabel(path)}</legend>
      {value.map((item, index) => (
        <div className="admin-list-item" key={index}>
          <div className="admin-list-item-header">
            <strong>{itemTitle(item, index)}</strong>
            <ItemControls
              index={index}
              length={value.length}
              onMove={(to) => updateList((list) => move(list, index, to))}
              onRemove={fixed ? undefined : () => updateList((list) => list.filter((_, i) => i !== index))}
            />
          </div>
          <FieldEditor
            docKey={docKey}
            path={[...path, index]}
            value={item}
            update={update}
            folder={folder}
            hideLabel={typeof item !== "object"}
          />
        </div>
      ))}
      {!fixed && (
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
      )}
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
    return (
      <fieldset className={path.length === 1 ? "admin-section" : "admin-group"}>
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
