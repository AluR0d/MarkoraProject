import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ReportService } from '../../services/reportService';
import { Report } from '../../types/Report';
import { useTranslation } from 'react-i18next';
import '../../styles/report.css';

export default function ReportHistory() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ReportService.getMyReports()
      .then(setReports)
      .catch((err) => {
        console.error('Error loading reports', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="report-page">
      <div className="report-box">
        <Typography variant="h5" align="center" className="mb-6">
          📁 {t('report.history_title')}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : reports.length === 0 ? (
          <Typography align="center" color="text.secondary">
            {t('report.no_reports')}
          </Typography>
        ) : (
          <div className="w-full overflow-auto rounded-md border border-gray-200">
            <TableContainer component={Paper} elevation={0}>
              <Table
                sx={{
                  minWidth: 500,
                  width: '100%',
                  tableLayout: 'auto',
                }}
                className="text-sm"
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'var(--color-primary)' }}>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('report.title')}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('report.range')}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('report.date')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow
                      key={report.id}
                      sx={{
                        '&:nth-of-type(even)': {
                          backgroundColor: 'rgba(0,0,0,0.02)',
                        },
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                      }}
                    >
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {report.title}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {report.range}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {new Date(report.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
}
