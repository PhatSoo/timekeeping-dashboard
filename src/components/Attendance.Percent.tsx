import { Container } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface IProps {
  title: string;
  count: number;
  total: number;
  color: string;
}

const CalculatePercent = (quantity: number, total: number) => {
  return Math.round((quantity / total) * 100);
};

const AttendanceItem = ({ title, count, total, color }: IProps) => (
  <Container>
    <h5>{title}</h5>
    <Container className='my-4' style={{ width: 150 }}>
      <CircularProgressbar styles={{ path: { stroke: color }, text: { fill: color } }} strokeWidth={3} value={CalculatePercent(count, total)} text={`${CalculatePercent(count, total)}%`} />
    </Container>
    <h5>
      {count}/{total} ({CalculatePercent(count, total)}%)
    </h5>
  </Container>
);

export default AttendanceItem;
