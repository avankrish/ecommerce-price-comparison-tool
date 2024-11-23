import React, { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import "./logsig.css"
import {Link} from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom";
function Signin(){
    const navigate=useNavigate()
    const [email,setemail]=useState("")
    const[pass,setpass]=useState("")
    const[cpass,setcpass]=useState("")
    const[err_email,seterr_email]=useState("")
    const[err_pass,seterr_pass]=useState("")
    const[err_cpass,seterr_cpass]=useState("")
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
        const cpass_validation=()=>
        {
            if(!cpass)
            {
                seterr_cpass("Confirm Your Password")
                return false
            }else if(pass!==cpass){
                seterr_cpass("Passwords do not match")
                return false
            }
            else{
                seterr_cpass("")
                return true
            }
        }
    const handlesubmit=async(e)=>
    {
        e.preventDefault()
        const isEmailValid=email_validation()
        const isPassValid=pass_validation()
        const isCpassValid=cpass_validation()
        if(isEmailValid&&isPassValid&&isCpassValid)
        {
            try{
                const res=await axios.post("http://localhost:5000/Signin",{email,password:pass});
                alert(res.data.message)
                alert("Login to activate the account")
                navigate("/login")

            }catch(error)
            {
                if( error.response && error.response.status===400)
                {
                    alert(error.response.data.message)
                }
            }
            
            
        }
    }
    return(
        <div className="logindaba">
           
           <div className="form-container"><div className="form-wrapper">
            <h3>Sign In</h3>
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
        <TextField
          required
          id="outlined-required"
          label="Confirm Password"
          type="password"
          value={cpass}
          onChange={(e)=>setcpass(e.target.value)}
          onBlur={cpass_validation}
          error={!!err_cpass}
          helperText={err_cpass}
        /><br></br>
        <Button type="submit" variant="outlined">Submit</Button>
</Box>
</div>
<div className="toggle-link" >
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
      </div>    
        </div>
    )
}
export default Signin