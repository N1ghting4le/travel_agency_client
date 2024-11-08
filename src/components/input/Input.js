import { TextField } from "@mui/material";
import "./input.css";

const fontFamily = "var(--font-montserrat)";

export const labelStyle = {
    fontFamily,
    bgcolor: "#fff",
    paddingRight: "5px"
};

export const helperStyle = {
    fontFamily,
    fontSize: "16px"
};

const Input = ({ placeholder, error, multiline, ...props }) => (
    <TextField
        sx={{ 
            "& .MuiInputLabel-root": labelStyle,
            "& .Mui-error": helperStyle
        }}
        fullWidth
        label={placeholder}
        error={!!error}
        multiline={multiline}
        {...props}
        helperText={error?.message}/>
);

export default Input;