import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
}

const DataTableSkeleton = ({
  columns = 5,
  rows = 10,
}: DataTableSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-black-1/10 bg-white dark:bg-black-1 dark:border-white/10">
      <Table>
        <TableHeader className="bg-secondary/10 dark:bg-black-2">
          <TableRow className="border-none">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i} className="px-4 py-3">
                <div className="bg-black-1/5 dark:bg-white/5 h-4 w-24 rounded" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-black-1/5 dark:border-white/5 hover:bg-transparent">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} className="px-4 py-3">
                  <div 
                    className={`bg-black-1/5 dark:bg-white/5 h-4 rounded animate-pulse ${
                      colIndex === 0 ? "w-8" : 
                      colIndex === columns - 1 ? "ml-auto w-20 rounded-full" : 
                      colIndex % 2 === 0 ? "w-32" : "w-24"
                    }`} 
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTableSkeleton;
