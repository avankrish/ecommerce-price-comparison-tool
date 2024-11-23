import React, { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import {Link, useNavigate} from "react-router-dom"
import axios from "axios";
function Login(){
    const navigate=useNavigate()
    const [email,setemail]=useState("")
    const[pass,setpass]=useState("")
    
    const[err_email,seterr_email]=useState("")
    const[err_pass,seterr_pass]=useState("")
    
    const email_validation=()=>
    {
        if (!email){
            seterr_email("Email id is mandatory to login")
            return false;
        }else if (!/\S+@\S+\.\S+/.test(email))
        {
            seterr_email("Email Format is Invalid")
            return false;
        }
        else{
            seterr_email("")
            return true;
        }
    }
    const pass_validation=()=>
        {
            if(!pass){
                seterr_pass("Password is mandatory to login")
                return false
            }else if(pass.length<6)
            {
                seterr_pass("Password must atleast be 6 characters")
                return false;
            }
            else{
                seterr_pass("")
                return true
            }
        }
        
    const handlesubmit=async (e)=>
    {
        e.preventDefault()
        const isEmailValid=email_validation()
        const isPassValid=pass_validation()
        
        if(isEmailValid&&isPassValid)
        {
            try {
                const response= await axios.post("http://localhost:5000/login",{email,password:pass});
                localStorage.setItem("token",response.data.token)
                alert("Login successful")
                navigate("/front_pg")
            }catch(error) {
                alert(error.response?.data.message || "An error occurred during login");
            }
            
        }
    }
    return(
        <div className="logindaba">
          
           <div className="form-container">
             <h3>Login</h3>
            <div className="form-wrapper">
           <Box
      component="form"
      onSubmit={handlesubmit}
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      Validate
      autoComplete="off"
    >
        <TextField
          required
          
          id="outlined-required"
          label="Email-id"
          value={email}
          onChange={(e)=>setemail(e.target.value)}
          onBlur={email_validation}
          error={!!err_email}
          helperText={err_email}
          
        /><br></br><br></br>
        <TextField
          required
          id="outlined-required"
          label="Password"
          type="password"
          value={pass}
          onChange={(e)=>setpass(e.target.value)}
          onBlur={pass_validation}
          error={!!err_pass}
          helperText={err_pass}
        /><br></br><br></br>
        
        <Button type="submit" variant="outlined">Submit</Button>
</Box>
</div>
<div className="toggle-link" >
        <p>
          Don't have an account ?Create one <Link to="/Signin">Sign In</Link>
        </p>
      </div>
      </div>
        </div>
    )
}
export default Login