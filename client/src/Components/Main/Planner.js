import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import
{
    Scheduler,
    DayView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import './index.scss'

let currentDate = new Date().toJSON();
const schedulerData = [
    { startDate: '2022-10-30T09:45', endDate: '2022-10-30T11:00', title: 'Meeting' },
    { startDate: '2022-10-30T12:00', endDate: '2022-10-30T13:30', title: 'Go to a gym' },
];

export default () => (
    <>
        <div className='scheduler'>
            <Paper>
                <Scheduler
                    data={schedulerData}>
                    <ViewState
                        currentDate={currentDate}
                    />
                    <DayView
                        startDayHour={7}
                        endDayHour={20}
                    />
                    <Appointments />
                </Scheduler>
            </Paper>
        </div>
    </>
);