import styles from "./TextInputWithLabel.module.css";

function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
  return (
    <div className={styles.field}>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        maxLength={1000}
        className={styles.input}
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      ></input>
    </div>
  );
}

export default TextInputWithLabel;
