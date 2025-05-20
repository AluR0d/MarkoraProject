import { TableCell, TableRow, IconButton, Link } from '@mui/material';
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
    <TableRow>
      <TableCell>{place.id}</TableCell>
      <TableCell>
        <Link
          component="a"
          href={`/admin/places/${place.id}`}
          style={{ textDecoration: 'none', color: '#1976d2' }}
        >
          {place.name}
        </Link>
      </TableCell>
      <TableCell>{place.zone}</TableCell>
      <TableCell>⭐ {place.rating || '—'}</TableCell>
      <TableCell>{place.active ? '✅' : '❌'}</TableCell>
      <TableCell>
        <IconButton onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
