import { TableCell, TableRow, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Place } from '../../types/Place';

type Props = {
  place: Place;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PlaceRow({ place, onEdit, onDelete }: Props) {
  return (
    <TableRow
      sx={{
        '&:hover': { backgroundColor: '#f9fafb' },
        transition: 'background-color 0.2s',
      }}
    >
      <TableCell className="font-mono text-sm text-gray-700">
        {place.id}
      </TableCell>

      <TableCell className="text-sm font-medium">
        <Link
          href={`/admin/places/${place.id}`}
          underline="hover"
          className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          {place.name}
        </Link>
      </TableCell>

      <TableCell className="text-sm text-gray-700">{place.zone}</TableCell>

      <TableCell className="text-sm text-yellow-600 font-medium">
        {place.rating ? `⭐ ${place.rating}` : '—'}
      </TableCell>

      <TableCell className="text-sm">
        {place.active ? (
          <span className="text-green-600 font-semibold">✅ Activo</span>
        ) : (
          <span className="text-red-500 font-semibold">❌ Inactivo</span>
        )}
      </TableCell>

      <TableCell className="flex gap-2 items-center">
        <button
          onClick={onEdit}
          className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
          title="Editar"
        >
          <EditIcon fontSize="small" />
        </button>

        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
          title="Eliminar"
        >
          <DeleteIcon fontSize="small" />
        </button>
      </TableCell>
    </TableRow>
  );
}
