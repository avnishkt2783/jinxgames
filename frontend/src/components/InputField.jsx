const InputField = ({type = "text",name, placeholder, value, required, onChange})=>{
    return(
        <>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                required={required}
                onChange={onChange}
            />
        </>
    )
}

export default InputField;