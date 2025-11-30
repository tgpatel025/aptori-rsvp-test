import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const ListEvents = () => {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
    },
    {
      field: 'description',
      headerName: 'Description',
    },
    {
      field: 'location',
      headerName: 'Location',
    },
    {
      field: 'time',
      headerName: 'Event Date & Time',
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h1">Invitations</Typography>
      <DataGrid columns={columns} rows={[]} />
    </Box>
  )
};

export default ListEvents;
