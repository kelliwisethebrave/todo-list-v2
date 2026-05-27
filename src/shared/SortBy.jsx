function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <>
      <label htmlFor="sortBy">Sort By</label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={(event) => onSortByChange(event.target.value)}
      >
        <option value="creationDate">Creation Date</option>
        <option value="title">Title</option>
      </select>
      <label htmlFor="sortDirection">Sort Direction</label>
      <select
        id="sortDirection"
        value={sortDirection}
        onChange={(event) => onSortDirectionChange(event.target.value)}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </>
  );
}

export default SortBy;
