import Box from '@mui/material/Box';
import LanguageSelector from '../atoms/LanguageSwitcher';

export default function MinimalHeader() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2,
        position: 'absolute',
        top: 0,
        right: 0,
      }}
    >
      <LanguageSelector />
    </Box>
  );
}
