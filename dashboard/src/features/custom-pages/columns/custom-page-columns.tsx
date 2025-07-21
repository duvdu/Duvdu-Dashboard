import { type ColumnDef } from '@tanstack/react-table';
import { type CustomPage } from '../types/custom-page.types';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const useCustomPageColumns = (refetch?: () => void): ColumnDef<CustomPage>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => row.original.title.en,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : '-',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link to={`../custom-pages/${row.original._id}`}>View</Link>
        </Button>
      </div>
    ),
  },
];
