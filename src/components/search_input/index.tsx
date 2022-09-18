import { useState, useEffect } from 'react';
// mui
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import './index.scss'

const SearchInput = (props: any) => {
  const { searchValue, setSearchValue, placeholderVal } = props
  const [inputFocus, setInputFocus] = useState(false)

  return (
    <div className='search-input input-size'>
      <FormControl variant="outlined" >
        <OutlinedInput
          type={'text'}
          value={searchValue}
          placeholder={`Search ${placeholderVal}`}
          onChange={(e) => {
            setSearchValue(e.target.value)
          }}
          sx={{ borderRadius: 0, backgroundColor: '#EDAC3C' }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
              >
                {inputFocus || searchValue !== '' ? <CloseIcon onClick={(e) => {
                  setSearchValue('')
                  setInputFocus(false)
                }} />
                  : <SearchIcon />}
              </IconButton>
            </InputAdornment>
          }

          onFocus={(e) => {
            e.target.placeholder = 'Type in your search'
            setInputFocus(true)
          }}
          onBlur={(e) => {
            // setSearchValue('')
            e.target.placeholder = `Search ${placeholderVal}`
            setInputFocus(false)
          }}
        />
      </FormControl>
    </div>
  )
}

export default SearchInput