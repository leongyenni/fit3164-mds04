// import React from 'react';
// import RangeSwitcher from './RangeSwitcher';
// import { useDispatch, useSelector } from 'react-redux';
// import { setChartState } from '../redux/chartSlice';
// import { setTimeRange } from '../redux/timeRangeSlice';
// import { ChartControlsProps } from '../types/ComponentTypes';
// import { dateFormatter } from '../utils/formattingUtils';
// import { AppState } from '../redux/store';
// import ControlButton from './ControlButton';

// const ChartControls: React.FC<ChartControlsProps> = ({ statsData }) => {
//     const dispatch = useDispatch();
//     const chartState = useSelector((state: AppState) => state.chartState);

//     const handleReset = () => {
//         dispatch(setChartState({ isReset: true }));
//     };

//     const handleFullscreen = () => {
//         dispatch(setChartState({ isFullscreen: true }));
//     };

//     return (
//         <div className="flex justify-between">
//             <div className="flex-1">
//                 <RangeSwitcher />
//             </div>

//             <div>
//                 <ControlButton
//                     icon={<VscAdd />}
//                     onClick={() => {}}
//                     tooltip="Add"
//                 />

//                 <ControlButton
//                     icon={<VscRefresh />}
//                     onClick={handleReset}
//                     tooltip="Refresh"
//                 />

//                 <ControlButton
//                     icon={<CiCamera />}
//                     onClick={() => {}}
//                     tooltip="Camera"
//                 />

//                 <ControlButton
//                     icon={<BsFullscreen />}
//                     onClick={handleFullscreen}
//                     tooltip="Fullscreen"
//                 />
//             </div>

//             {/* 
//             <div className="text-base text-slate-400 absolute px-2 py-1 top-1 right-8">
//                 Closed: {dateFormatter(statsData.closingTime)} (UTC - 4)
//             </div> 
//             */}
//         </div>
//     );
// };

// export default ChartControls;
