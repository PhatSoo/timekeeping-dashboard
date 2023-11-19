'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUserTie, FaClock, FaUserCheck, FaChartBar } from 'react-icons/fa';
const data = [
  { name: 'Home', icon: <FaHome />, link: '/' },
  { name: 'Employee', icon: <FaUserTie />, link: '/employee' },
  { name: 'Shift', icon: <FaClock />, link: '/shift' },
  { name: 'Attendance', icon: <FaUserCheck />, link: '/attendance' },
  { name: 'Statistic', icon: <FaChartBar />, link: '#' },
];

const active: string = 'bg-secondary text-white fw-bold';
const inActive: string = 'link-secondary';

const MenuItem = () => {
  const pathname = usePathname();

  const renderItem = (item: { name: string; icon: JSX.Element; link: string }, idx: number) => {
    return (
      <Link href={item.link} key={idx} className={`d-flex align-items-center gap-3 border p-2 rounded hover text-decoration-none ${pathname === item.link ? active : inActive}`}>
        {item.icon}
        {item.name}
      </Link>
    );
  };

  return <div className='d-flex gap-4 flex-column'>{data && data.map((item, idx) => renderItem(item, idx))}</div>;
};

export default MenuItem;
