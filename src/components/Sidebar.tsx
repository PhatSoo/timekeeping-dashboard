import InfoBottom from './Sidebar.InfoBottom';
import { GiTopHat } from 'react-icons/gi';
import MenuItem from './Sidebar.MenuItem';

const Sidebar = () => {
  return (
    <div className='p-2' style={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
      <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 10, padding: 5, borderBottom: '2px solid #f3f5f6' }}>
        <GiTopHat size={40} />
        <div>LTP Company Dashboard</div>
      </div>
      <div style={{ height: 100, flexGrow: 1, padding: 10 }}>
        <MenuItem />
      </div>
      <div className='py-2' style={{ height: 60, borderColor: 'black', borderTop: '2px solid #f3f5f6' }}>
        <InfoBottom />
      </div>
    </div>
  );
};

export default Sidebar;
