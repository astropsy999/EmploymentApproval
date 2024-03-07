import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useRange } from '../store/dataStore';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

export default function ObjectFilterMono({ objectsArr }) {
  //   const [object, setObject] = React.useState('');
  const { filteredObj, setFilteredObj } = useRange();

  React.useEffect(() => {
    setFilteredObj('Все объекты');
  }, []);

  const handleChange = (event) => {
    setFilteredObj(event.target.value);
  };

  const handleClear = () => {
    setFilteredObj('Все объекты');
  };

  const bgColor = filteredObj === 'Все объекты' ? 'white' : '#e7effc';

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
        Объект
      </InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={filteredObj}
        label="Объект"
        onChange={handleChange}
        endAdornment={
          filteredObj !== 'Все объекты' && (
            <IconButton onClick={handleClear} size="small">
              <ClearIcon />
            </IconButton>
          )
        }
      >
        <MenuItem value="Все объекты">
          <em>Все объекты</em>
        </MenuItem>
        {objectsArr.length !== 0 &&
          objectsArr.map((item) => {
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
