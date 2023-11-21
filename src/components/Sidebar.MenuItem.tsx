'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUserTie, FaClock, FaUserCheck, FaChartBar, FaWpforms, FaBell } from 'react-icons/fa';
const data = [
  { name: 'Home', icon: <FaHome />, link: '/', notify: false },
  { name: 'Employee', icon: <FaUserTie />, link: '/employee', notify: false },
  { name: 'Shift', icon: <FaClock />, link: '/shift', notify: false },
  { name: 'Attendance', icon: <FaUserCheck />, link: '/attendance', notify: false },
  { name: 'Form Requests', icon: <FaWpforms />, link: '/form-request', notify: true },
  { name: 'Statistic', icon: <FaChartBar />, link: '/statistic', notify: false },
];

const active: string = 'bg-secondary text-white fw-bold';
const inActive: string = 'link-secondary';

const MenuItem = () => {
  const pathname = usePathname();

  const renderItem = (item: { name: string; icon: JSX.Element; link: string; notify: boolean }, idx: number) => {
    return (
      <Link href={item.link} key={idx} className={`d-flex position-relative align-items-center gap-3 border p-2 rounded hover text-decoration-none ${pathname === item.link ? active : inActive}`}>
        {item.icon}
        {item.name}
        {item.notify && (
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
