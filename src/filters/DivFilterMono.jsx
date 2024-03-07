import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useRange } from '../store/dataStore';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

export default function DivFilterMono({ divesArr }) {
  const { filteredDiv, setFilteredDiv } = useRange();

  React.useEffect(() => {
    setFilteredDiv('Все отделы');
  }, []);

  const handleChange = (event) => {
    setFilteredDiv(event.target.value);
  };

  const handleClear = () => {
    // setPersonName([]);
    setFilteredDiv('Все отделы');
  };

  const bgColor = filteredDiv === 'Все отделы' ? 'white' : '#e7effc';

  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: 120,
        bgcolor: bgColor,
        borderBlockColor: '#2e66b9',
      }}
      size="small"
    >
      <InputLabel id="demo-select-small" sx={{ color: '#2e66b9' }}>
        Подразделения
      </InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={filteredDiv}
        label="Подразделения"
        onChange={handleChange}
        endAdornment={
          filteredDiv !== 'Все отделы' && (
            <IconButton onClick={handleClear} size="small">
              <ClearIcon />
            </IconButton>
          )
        }
      >
        <MenuItem value="Все отделы">
          <em>Все отделы</em>
        </MenuItem>
        {divesArr.length !== 0 &&
          divesArr.map((item) => {
            return (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
}
