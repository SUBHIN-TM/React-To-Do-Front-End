/* eslint-disable react/no-unescaped-entities */
// import React, { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Link,useNavigate} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Login() {
    
    const[name,setName]=useState("");
    const[password,setPassword]=useState("");
    const navigate=useNavigate();

    useEffect(() => {
      const token=localStorage.getItem('token')
      if(token){
        navigate('/dashboard');
      }
    },[])
    
 
    let onChangeFunction =(e)=>{
     e.target.name=="name"?setName(e.target.value) :setPassword(e.target.value);
    }

    const handleSubmit =async (event)=>{
    event.preventDefault();
     if(!name || !password){
     return toast.error("Please Fill The Field")
     }

    try {
        console.log(name , password);
       const response=await axios.post('http://localhost:4000/login',{
        name,password
       });
       if(response.data.invalidUser){
        console.log("invalid");
        toast.error("Invalid User")
       }else if(response.data.passwordMissmatch){
        toast.error("Wrong Password")
       }else{
        console.log(response.data);
        localStorage.setItem('token',response.data.token)
        navigate('/dashboard')
       }
      
    } catch (error) {
        console.error("Login Error");
    }
    }

  return (
    <div className="border-4 bg-slate-200 h-screen w-screen flex flex-col justify-center items-center ">
      <h1 className="p-4 my-4 text-2xl font-serif ">To Do App</h1>
      <div className="border-[1px] border-black rounded-lg p-8 flex   h-[300px]">
        <form onSubmit={handleSubmit} className="mt-4" action="">
          <label className="mr-10 " htmlFor="userName">
            Email
          </label>
          <input className="mb-6 pl-2 text-gray-500 hover:border-gray-500" type="text" name="name" id="name" value={name} onChange={(e)=> onChangeFunction(e)} />
          <br />
          <label className="mr-3" htmlFor="password">
            Password
          </label>
          <input className="mb-8  pl-2 text-gray-500 hover:border-gray-500" type="password" name="password" id="password" value={password} onChange={(e)=> onChangeFunction(e)} />
          <br />
          <button type="submit" className="p-1 bg-white font-semibold rounded-md px-4 ml-[90px] hover:bg-slate-700 hover:text-white">Login</button>
          <p className="mt-10 italic">Don't Have an account <span className="text-blue-700"><Link to='/signup'>Signup</Link></span> Here</p>
        </form>
       
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
