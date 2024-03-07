import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useRange } from '../store/dataStore';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function ObjectFilter({ objectsArr }) {
  const { filteredObj, setFilteredObj } = useRange();
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setFilteredObj(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleClear = () => {
    // setPersonName([]);
    setFilteredObj([]);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="demo-multiple-chip-label">Объект</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={filteredObj}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Объект" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          endAdornment={
            filteredObj.length ? (
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            ) : null
          }
        >
          {objectsArr.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, filteredObj, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
