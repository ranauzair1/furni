exports.pagination = ({ page = page ?? 1, size = size ?? 10 }) => {
  page = page - 1
  const offset = size * page
  const limit = size
  return {
    offset,
    limit
  }
}
