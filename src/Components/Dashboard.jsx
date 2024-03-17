/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]); //SET TO STORE ALL TASKS
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState("");
  const [userName, setUserName] = useState(""); //TO SHOW USER NAME ON THE TOP
  console.log("render time");
  const [editTaskId, setEditTaskId] = useState("");
  const [editedTask, setEditedTask] = useState({
    date: "",
    task: "",
    status: "",
  });

  useEffect(() => {
    dashboardGet();
  }, []);

  const onchangingDate = (e) => {
    setNewDate(e.target.value);
  };

  const onchangingTask = (e) => {
    setNewTask(e.target.value);
  };

  const dashboardGet = async () => {
    //CALLED TO GET THE WHOLE DATAS OF USER TO GET
    try {
      const response = await axios.get("http://localhost:4000/dashboard");
      if (response.data.success) {
        setTasks(response.data.datas); //DATA BASE DATAS ARE ADDED TO LOCAL STATE
        setUserName(response.data.name);
      } else {
        navigate("/"); //IF ANY EROR OCCUR RELOGIN
      }
    } catch (error) {
      console.error("Error from fetching dashboard geting datas", error);
    }
  };

  console.log("tasks", tasks);
  const taskAdd = () => {
    if (!newTask || !newDate) {
      return toast.error("Cant be Empty Field");
    } else {
      const newTaskObjetc = { date: newDate, task: newTask, status: "Pending" };
      setTasks([...tasks, newTaskObjetc]);
      setNewDate("");
      setNewTask("");
      postTask(newTaskObjetc); //NEW  ADDED DATA SEND TO FUNCTION FOR SAVE IN DATABASE
    }
  };

  const postTask = async (newTaskObjetc) => {
    //NEW DATA CAME HERE AND SEND TO THE SERVER FOR WRITE IN DATA BASE
    try {
      const response = await axios.post("http://localhost:4000/addTask", {
        newTaskObjetc,
      });
      if (response.data.added) {
        toast.success("Task Added Successfully");
      } else {
        toast.error("Unexpected Error Occured");
      }
    } catch (error) {
      console.error("Error from posting new task to database", error);
    }
  };

  const logout = async () => {
    //USER LOGOUT
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    navigate("/");
  };

  const deleteTask = async (id) => {
    try {
      let filterDeletedTask = tasks.filter((task) => task._id !== id);
      setTasks(filterDeletedTask);
      console.log("deleted", filterDeletedTask, id);
      let response = await axios.delete(
        "http://localhost:4000/deleteTask/" + id
      );
      if (response.status == 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Cant delete right now ");
      console.error("error", error);
    }
  };

  const editTaskID = (task) => {
    setEditTaskId(task._id);
    const dateParts = task.date.split("T")[0].split("-");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    setEditedTask({
      date: formattedDate.split("-").reverse().join("-"),
      task: task.task,
      status: task.status,
    });
  };

  const cancelEdit = () => {
    setEditTaskId(null);
  };

  let modifiedAndMerged;
  const saveEdit = async (id) => {
    try {
      if(!editedTask.date || !editedTask.task.trim() || !editedTask.status){
        return toast.error("All Field Must be filled")
      }
      const updatedTask = tasks.map((task) => {
        if (id == task._id) {
          modifiedAndMerged = { ...task, ...editedTask };
          return modifiedAndMerged;
        }
        return task;
      });
      setTasks(updatedTask);
      setEditTaskId(null);
      let response = await axios.put("http://localhost:4000/editTask/" + id, {
        modifiedAndMerged,
      });
      if (response.status == 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.success("Cannot Perform Udate Now");
      console.error(error);
    }
  };

  console.log("edited prefill", editedTask);
  return (
    <div>
      <h1 className="my-3 text-center text-xl font-semibold underline">
        TO DO
      </h1>
      <div className="flex items-center">
        {userName && <p className="font-mono italic ml-6 ">{userName}</p>}
        <button
          onClick={() => logout()}
          className="text-white bg-black ml-2 p-1 px-2 rounded-lg font-semibold"
        >
          Log Out
        </button>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-3 gap-2 mt-11">
        <div className=" ">
          <label className="mx-2 ml-8" htmlFor="date">
            Date
          </label>
          <input
            className="w-7/12"
            type="date"
            name="date"
            id="date"
            value={newDate}
            onChange={(e) => onchangingDate(e)}
          />
        </div>
        <div className=" col-span-2 ">
          <label className="w-3/12 ml-8 mx-3" htmlFor="task">
            Task
          </label>
          <input
            className="w-8/12"
            type="text"
            name="task"
            id=""
            value={newTask}
            onChange={(e) => onchangingTask(e)}
          />
          <button
            className="mt-2 sm:mt-0 ml-[70px] px-2 sm:ml-3 font-bold rounded-lg"
            onClick={() => taskAdd()}
          >
            Add
          </button>
        </div>
      </div>
      <div className="mt-[40px]  overflow-auto sm:overflow-hidden flex justify-center">
        <table className="border-collapse border  sm:w-11/12 border-gray-400 text-center">
          <thead className="text-center">
            <tr className="">
              <th className="border p-2 w-1/12 ">No</th>
              <th className="border w-2/12 sm:w-auto">Date</th>
              <th className="border w-2/12 sm:w-auto whitespace-normal">
                Task
              </th>
              <th className="border w-2/12 sm:w-auto">Status</th>
              <th className="border w-2/12 sm:w-auto">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((dataTasks, index) => (
              <tr className="border-2 p-2" key={dataTasks._id}>
                <td className="border">{index + 1}</td>
                <td className="border">
                  {editTaskId == dataTasks._id ? (
                    <input
                      type="date"
                      value={editedTask.date}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, date: e.target.value })
                      }
                    ></input>
                  ) : (
                    dataTasks.date.split("T")[0]
                  )}
                </td>
                <td className="border-2 whitespace-normal">
                  {editTaskId == dataTasks._id ? (
                    <input
                      type="text"
                      value={editedTask.task}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, task: e.target.value })
                      }
                    ></input>
                  ) : (
                    dataTasks.task
                  )}
                </td>
                <td className="border">
                  {editTaskId == dataTasks._id ? (
                    <select
                      name=""
                      id=""
                      value={editedTask.status}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, status: e.target.value })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Done">Done</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    dataTasks.status
                  )}
                </td>
                <td className="flex justify-around p-2 ">
                  {editTaskId == dataTasks._id ? (
                    <>
                      <button
                        className="p-1 rounded-lg bg-black text-white"
                        onClick={() => saveEdit(dataTasks._id)}
                      >
                        Save
                      </button>
                      <button
                        className="p-1 rounded-lg bg-black text-white"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="p-1 rounded-lg bg-black text-white"
                        onClick={() => deleteTask(dataTasks._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="p-1 px-2 rounded-lg bg-black text-white"
                        onClick={() => editTaskID(dataTasks)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
