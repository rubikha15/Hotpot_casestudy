namespace HotByte.Helpers
{
    public static class PaginationHelper
    {
        public static IEnumerable<T> Paginate<T>(
            IEnumerable<T> data,
            int pageNumber,
            int pageSize)
        {
            return data
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);
        }
    }
}