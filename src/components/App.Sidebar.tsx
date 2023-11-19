import InfoBottom from './Sidebar.InfoBottom';
import { GiTopHat } from 'react-icons/gi';
import MenuItem from './Sidebar.MenuItem';

const Sidebar = () => {
  return (
    <div className='p-2 d-flex flex-column justify-content-center gap-3 h-100 w-100'>
      <div className='d-flex align-items-center gap-2 p-1 border-bottom border-2 border-gray-300' style={{ height: '60px' }}>
        <GiTopHat size={40} />
        <div>LTP Company Dashboard</div>
      </div>
      <div className='h-100 p-2 flex-grow-1'>
        <MenuItem />
      </div>
      <div className='py-2 d-flex flex-column gap-2 border-top border-2 border-gray-300'>
        <InfoBottom />
      </div>
    </div>
  );
};

export default Sidebar;
