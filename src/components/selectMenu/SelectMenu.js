'use client';

import { labelStyle, helperStyle } from "../input/Input";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";

const SelectMenu = ({ children, values, name, control, error, defaultValue, onChange = () => {}, multiple = false, disableScrollLock = false }) => {
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 200,
                overflowX: "auto"
            }
        }
    };

    const openMenu = () => {
        if (!disableScrollLock) document.scrollingElement.style.overflow = "hidden";
    }

    const closeMenu = () => {
        if (!disableScrollLock) document.scrollingElement.style.overflow = "auto";
    }

    const renderMenuItems = () => values.map(value => (
        <MenuItem
            key={value}
            value={value}
            sx={{"&.Mui-selected": {fontWeight: 550}}}>{value}</MenuItem>
    ));

    const menuItems = renderMenuItems();

    return (
        <FormControl fullWidth>
            <InputLabel error={!!error} sx={labelStyle}>{children}</InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange: formChange } }) => 
                    <Select
                        label={children}
                        defaultValue={defaultValue || (multiple ? [] : "")}
                        MenuProps={MenuProps}
                        onChange={(e) => {
                            formChange(e);
                            onChange(e);
                        }}
                        onOpen={openMenu}
                        onClose={closeMenu}
                        error={!!error}
                        multiple={multiple}>
                        {menuItems}
                    </Select>
                }
            />
            {error && <FormHelperText sx={helperStyle} error>{error.message}</FormHelperText>}
        </FormControl>
    );
}

export default SelectMenu;