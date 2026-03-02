export default function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array?.from({ length: rows })?.map((_, i) => (
        <tr key={i}>
          {/* Avatar + name */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3 hidden md:table-cell">
            <div className="space-y-1.5">
              <div className="h-3.5 w-36 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </td>
          <td className="px-4 py-3 hidden lg:table-cell">
            <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
          </td>
          <td className="px-4 py-3 hidden sm:table-cell">
            <div className="h-5 w-14 bg-gray-100 rounded-full animate-pulse" />
          </td>
          <td className="px-4 py-3 hidden xl:table-cell">
            <div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" />
          </td>
          <td className="px-4 py-3">
            <div className="h-7 w-7 bg-gray-100 rounded-lg animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );
}
