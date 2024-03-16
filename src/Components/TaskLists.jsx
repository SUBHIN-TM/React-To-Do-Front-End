/* eslint-disable react/prop-types */
const TaskLists=({dataTasks,index})=>{
    return(
        <tr className="text-center">
            <td>{index +1}</td>
            <td >{dataTasks.date}</td>
            <td>{dataTasks.task}</td>
            <td>
                <select name="" id="">
                    <option value="">{dataTasks.status}</option>
                    <option value="">Done</option>
                    <option value="">Cancelled</option>
                </select>
                </td>
            <td className="flex justify-around">
                <button>Delete</button>
                <button>Edit</button>
            </td>
        </tr>
     
    )

}

export default TaskLists;