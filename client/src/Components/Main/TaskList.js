import React from 'react'
import { Link } from 'react-router-dom'
import TaskForm from './TaskForm';

const TaskList = ( { tasks } ) =>
{

    if( !tasks.length ) {
        return <div>
            <TaskForm /> <h3>No Tasks yet!</h3> </div>;
    }

    return (
        <div>
            <TaskForm />
            <h3 className='title'>Tasks</h3>
            {tasks &&
                tasks.map( task => (
                    <div key={task._id} className="taskContainer">
                        <div className="task">
                            <p
                                to={`/profile/${ task.username }`}
                                style={{ fontWeight: 700 }}
                                className="taskUsername"
                            >
                                {task.username}
                            </p>{' '}
                            task on {task.createdAt}
                        </div>
                        <div className="">
                                <p className='taskText'>{task.taskText}</p>
                        </div>
                    </div>
                ) )}
        </div>
    )
}

export default TaskList