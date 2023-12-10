'use client';
import { FormRequestContext } from '@/context/FormRequest';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { FaHome, FaUserCheck, FaChartBar, FaBell, FaHourglassHalf, FaCalendarAlt, FaUsers, FaClipboard, FaUserTag, FaRegSun } from 'react-icons/fa';

const data = [
  { name: 'Dashboard', icon: <FaHome />, link: '/', notify: false },
  { name: 'Role', icon: <FaUserTag />, link: '/role', notify: false },
  { name: 'Shift', icon: <FaHourglassHalf />, link: '/shift', notify: false },
  { name: 'Employee', icon: <FaUsers />, link: '/employee', notify: false },
  { name: 'Attendance', icon: <FaUserCheck />, link: '/attendance', notify: false },
  { name: 'Part-time Schedule', icon: <FaCalendarAlt />, link: '/schedule', notify: false },
  { name: 'Form Requests', icon: <FaClipboard />, link: '/form-request', notify: true },
  { name: 'Statistic', icon: <FaChartBar />, link: '/statistic', notify: false },
  // { name: 'Settings', icon: <FaRegSun />, link: '/settings', notify: false },
];

const active: string = 'bg-secondary text-white fw-bold';
const inActive: string = 'link-secondary';

const MenuItem = () => {
  const pathname = usePathname();
  const formContext = useContext(FormRequestContext);

  const renderItem = (item: { name: string; icon: JSX.Element; link: string; notify: boolean }, idx: number) => {
    return (
      <Link href={item.link} key={idx} className={`d-flex position-relative align-items-center gap-3 border p-2 rounded hover text-decoration-none ${pathname === item.link ? active : inActive}`}>
        {item.icon}
        {item.name}
        {item.notify && formContext && formContext?.pending > 0 && (
          <div className='position-absolute top-0 start-100 translate-middle rounded-circle p-1 d-flex justify-content-center align-items-center' style={{ backgroundColor: '#e41e3f' }}>
            <FaBell color={'#fff'} />
          </div>
        )}
      </Link>
    );
  };

  return <div className='d-flex gap-4 flex-column'>{data && data.map((item, idx) => renderItem(item, idx))}</div>;
};

export default MenuItem;
