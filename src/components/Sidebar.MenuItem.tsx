import { ListGroup } from 'react-bootstrap';
import { FaHome, FaUserTie, FaClock, FaUserCheck, FaChartBar } from 'react-icons/fa';
const data = [
  { name: 'Home', icon: <FaHome /> },
  { name: 'Employee', icon: <FaUserTie /> },
  { name: 'Shift', icon: <FaClock /> },
  { name: 'Attendances', icon: <FaUserCheck /> },
  { name: 'Statistic', icon: <FaChartBar /> },
];

const renderItem = (item: { name: string; icon: JSX.Element }, idx: number) => {
  return (
    <ListGroup.Item key={idx} action style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      {item.icon}
      {item.name}
    </ListGroup.Item>
  );
};

const MenuItem = () => {
  return <ListGroup>{data && data.map((item, idx) => renderItem(item, idx))}</ListGroup>;
};

export default MenuItem;
