import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function UserTableActions({ onEdit, onDelete }: Props) {
  return (
    <>
      <IconButton onClick={onEdit}>
        <EditIcon />
      </IconButton>
      <IconButton color="error" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </>
  );
}
