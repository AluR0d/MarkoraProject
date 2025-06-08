import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const FlagES = 'https://flagcdn.com/es.svg';
  const FlagEN = 'https://flagcdn.com/us.svg';

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: 'black', ml: 1 }}>
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleSelect('es')}>
          <img src={FlagES} alt="ES" width={24} />
        </MenuItem>
        <MenuItem onClick={() => handleSelect('en')}>
          <img src={FlagEN} alt="EN" width={24} />
        </MenuItem>
      </Menu>
    </>
  );
}
