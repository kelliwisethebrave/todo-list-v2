import styles from "./FilterInput.module.css";

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div>
      <label htmlFor="filterInput">Search todos:</label>&nbsp;
      <input
        id="filterInput"
        type="text"
        className={styles.smallInput}
        value={filterTerm}
        onChange={(event) => onFilterChange(event.target.value)}
        placeholder="🔍 Search by title..."
      />
    </div>
  );
}

export default FilterInput;
