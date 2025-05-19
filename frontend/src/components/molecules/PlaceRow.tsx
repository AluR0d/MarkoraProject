import { TableCell, TableRow, IconButton } from '@mui/material';
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
      <TableCell>{place.name}</TableCell>
      <TableCell>{place.zone}</TableCell>
      <TableCell>{place.phone}</TableCell>
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
