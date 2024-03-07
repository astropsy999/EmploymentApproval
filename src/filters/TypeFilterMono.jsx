import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useRange } from '../store/dataStore';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { getInitialTypeSubtypesData } from '../data/api';

export default function TypeFilterMono({ typesArr }) {
  //   const [object, setObject] = React.useState('');
  const {
    filteredType,
    setFilteredType,
    setSubTypesArr,
    typesSubtypesBase,
    setTypesSubtypesBase,
    subTypesArr, 
    initialLoadedSubtypes
  } = useRange();


  React.useEffect(() => {
    setFilteredType('Все работы');
    getInitialTypeSubtypesData().then(res => {
      setTypesSubtypesBase(res);
    })
  }, []);

  const handleChange = (event) => {
    setFilteredType(event.target.value);
    let commonElements = typesSubtypesBase[event.target.value].filter(
      (element) => initialLoadedSubtypes.includes(element),
    );
    setSubTypesArr(commonElements);
  };

  const handleClear = () => {
    setFilteredType('Все работы');
    setSubTypesArr(initialLoadedSubtypes);
  };

  const bgColor = filteredType === 'Все работы' ? 'white' : '#e7effc';

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
        Работы
      </InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={filteredType}
        label="Работы"
        onChange={handleChange}
        endAdornment={
          filteredType !== 'Все работы' && (
            <IconButton onClick={handleClear} size="small">
              <ClearIcon />
            </IconButton>
          )
        }
      >
        <MenuItem value="Все работы">
          <em>Все работы</em>
        </MenuItem>
        {typesArr.length !== 0 &&
          typesArr.map((item) => {
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
