import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  keyExtractor, 
  onRowClick,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="data-table p-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="data-table overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr 
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={cn(onRowClick && 'cursor-pointer')}
            >
              {columns.map((column) => (
                <td key={`${keyExtractor(item)}-${column.key}`} className={column.className}>
                  {column.render 
                    ? column.render(item) 
                    : String((item as Record<string, unknown>)[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
