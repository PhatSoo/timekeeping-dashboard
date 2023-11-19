'use client';
import { Card } from 'react-bootstrap';

interface IProp {
  Title: string;
  Content: number;
}

const CardItem = ({ Title, Content }: IProp) => {
  return (
    <Card style={{ width: '18rem' }} className='shadow p-3 mb-5 bg-white rounded'>
      <Card.Body>
        <Card.Title>{Title}</Card.Title>
        <Card.Text>
          Tổng cộng: {Content} {Title}
        </Card.Text>
        <Card.Link href='#' className='btn btn-primary'>
          Xem chi tiết
        </Card.Link>
      </Card.Body>
    </Card>
  );
};

export default CardItem;
