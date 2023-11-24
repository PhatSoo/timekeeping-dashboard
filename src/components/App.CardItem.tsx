'use client';
import { Card } from 'react-bootstrap';
import Link from 'next/link';

interface IProp {
  Title: string;
  Content: number;
  Href: string;
}

const CardItem = ({ Title, Content, Href }: IProp) => {
  return (
    <Card style={{ width: '18rem' }} className='shadow p-3 mb-5 bg-white rounded'>
      <Card.Body>
        <Card.Title>{Title}</Card.Title>
        <Card.Text>
          Tổng cộng: {Content} {Title}
        </Card.Text>
        <Link href={Href} className='btn btn-primary'>
          Xem chi tiết
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CardItem;
