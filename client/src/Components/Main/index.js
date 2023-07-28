import React from 'react'
import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';
import { QUERY_TASKS, QUERY_ME_BASIC } from '../../utils/queries';
import TaskList from './TaskList'
import Planner from './Planner'

const Main = () =>
{
    const { loading, data } = useQuery( QUERY_TASKS );
    const { data: userData } = useQuery( QUERY_ME_BASIC );
    const tasks = data?.tasks || [];

    const loggedIn = Auth.loggedIn();
    const sessionExpired = Auth.isTokenExpired();

    return (
        <>
            {loggedIn && (
            <div className='home-page container'>
                    <div className='planner-container'>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            // <TaskList
                            //     tasks={tasks}
                            // />
                                <Planner/>
                        )}
                    </div>
                </div>
                )}
        </>
    )
}

export default Main