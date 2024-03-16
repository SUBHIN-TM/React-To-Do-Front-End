/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import TaskLists from './TaskLists';



function Dashboard() {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    console.log("tasks",tasks)
    const [newTask, setNewTask] = useState("")
    const [newDate, setNewDate] = useState("")
    const [userName, setUserName] = useState("")

    useEffect(() => {
        dashboardGet()
    }, [])


    const onchangingDate = (e) => {
        setNewDate(e.target.value)
    };

    const onchangingTask = (e) => {
        setNewTask(e.target.value)
    };

    const dashboardGet = async () => { //CALLED TO GET THE WHOLE DATAS OF USER TO GET
        try {
            const response = await axios.get('http://localhost:4000/dashboard')
            if (response.data.success) {
                setTasks(response.data.datas)  //DATA BASE DATAS ARE ADDED TO LOCAL STATE
                setUserName(response.data.name)
            } else {
                navigate('/') //IF ANY EROR OCCUR RELOGIN 
            }
        } catch (error) {
            console.error("Error from fetching dashboard geting datas",error);
        }
    }
 

    const taskAdd = () => {
        if (!newTask || !newDate) {
            return toast.error("Cant be Empty Field")
        } else {
            const newTaskObjetc={ date: newDate, task: newTask, status: "Pending" }
            setTasks([...tasks,newTaskObjetc])
            setNewDate("")
            setNewTask("")
            postTask(newTaskObjetc)  //NEW  ADDED DATA SEND TO FUNCTION FOR SAVE IN DATABASE
        }
    }

 
    const postTask = async (newTaskObjetc) => {//NEW DATA CAME HERE AND SEND TO THE SERVER FOR WRITE IN DATA BASE
        try {
            const response = await axios.post('http://localhost:4000/addTask', {newTaskObjetc})
            if (response.data.added) {
                toast.success("Task Added Successfully")
            } else {
                toast.error("Unexpected Error Occured")
            }      
        } catch (error) {
            console.error("Error from posting new task to database",error);
        }   
    }

    const logout = async () => { //USER LOGOUT 
        localStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = null;
        navigate('/');
    }
   
    const deleteTask= async(id)=>{
        try {
            let filterDeletedTask=tasks.filter((task) => task._id !== id)
        setTasks(filterDeletedTask)
        console.log("deleted",filterDeletedTask,id);
        let response=await axios.delete('http://localhost:4000/deleteTask/'+id)
        if(response.status==200){
            toast.success(response.data.message)    
        }
            
        } catch (error) {         
            toast.error("Cant delete right now ")
            console.error("error",error)            
        }        
    }

    return (
        <div>
            <h1 className='my-3 text-center text-xl font-semibold underline'> TO DO </h1>
            <div className='flex items-center'>
                {userName && <p className='font-mono italic ml-6 '>{userName}</p>}
                <button onClick={() => logout()} className='text-white bg-black ml-2 p-1 px-2 rounded-lg font-semibold'>Log Out</button>
            </div>

            <div className=' grid grid-cols-1 sm:grid-cols-3 gap-2 mt-11'>
                <div className=' '>
                    <label className='mx-2 ml-8' htmlFor="date">Date</label>
                    <input className='w-7/12' type="date" name="date" id="date" value={newDate} onChange={(e) => onchangingDate(e)} />
                </div>
                <div className=' col-span-2 '>
                    <label className='w-3/12 ml-8 mx-3' htmlFor="task">Task</label>
                    <input className='w-8/12' type="text" name="task" id="" value={newTask} onChange={(e) => onchangingTask(e)} />
                    <button className='mt-2 sm:mt-0 ml-[70px] px-2 sm:ml-3 font-bold rounded-lg' onClick={() => taskAdd()}>Add</button>
                </div>
            </div>
            <div className='mt-[40px] border m-auto'>

            <table className='border-collapse border border-gray-400 text-center'>
                    <thead>
                        <tr>
                            <th className='border p-2 '>Sl No</th>
                            <th className='border p-2 w-2/12'>Date</th>
                            <th className='border w-4/12'>Task</th>
                            <th className='border p-2 w-1/12'>Status</th>
                            <th className='border p-2 w-2/12'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((dataTasks, index) => (
                            <tr key={dataTasks._id}>
                                <td>{index + 1}</td>
                                <td>{dataTasks.date}</td>
                                <td>{dataTasks.task}</td>
                                <td>
                                    <select name="" id="">
                                        <option value="">{dataTasks.status}</option>
                                        <option value="">Done</option>
                                        <option value="">Cancelled</option>
                                    </select>
                                </td>
                                <td className="flex justify-around">
                                    <button onClick={()=>deleteTask(dataTasks._id)}>Delete</button>
                                    <button>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Dashboard;
