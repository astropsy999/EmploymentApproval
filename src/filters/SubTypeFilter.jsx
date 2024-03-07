import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useRange } from '../store/dataStore';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

export default function SubTypeFilter({ subTypesArr }) {
  //   const [object, setObject] = React.useState('');
  const { filteredSubType, setFilteredSubType } = useRange();

  React.useEffect(() => {
    setFilteredSubType('Все подвиды');
  }, []);

  const handleChange = (event) => {
    setFilteredSubType(event.target.value);
  };

  const handleClear = () => {
    setFilteredSubType('Все подвиды');
  };

  const bgColor = filteredSubType === 'Все подвиды' ? 'white' : '#e7effc';

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
        Подвид работ
      </InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={filteredSubType}
        label="Подвид работ"
        onChange={handleChange}
        endAdornment={
          filteredSubType !== 'Все подвиды' && (
            <IconButton onClick={handleClear} size="small">
              <ClearIcon />
            </IconButton>
          )
        }
      >
        <MenuItem value="Все подвиды">
          <em>Все подвиды</em>
        </MenuItem>
        {subTypesArr.length !== 0 &&
          subTypesArr.map((item) => {
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
