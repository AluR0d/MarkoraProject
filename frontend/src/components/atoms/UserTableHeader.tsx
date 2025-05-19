import { TableCell, TableRow } from '@mui/material';

export default function UserTableHeader() {
  return (
    <TableRow>
      <TableCell>ID</TableCell>
      <TableCell>Nombre</TableCell>
      <TableCell>Email</TableCell>
      <TableCell>Roles</TableCell>
      <TableCell>Acciones</TableCell>
    </TableRow>
  );
}
