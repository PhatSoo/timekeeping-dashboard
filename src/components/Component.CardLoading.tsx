import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';

const CardItem = () => {
  return (
    <Card style={{ width: '18rem' }}>
      <Placeholder as='div' animation='glow'>
        <Placeholder xs={12} />
      </Placeholder>
      <Card.Body style={{ height: '200px' }}>
        <Placeholder as='div' animation='glow'>
          <Placeholder xs={8} />
          <Placeholder xs={4} />
        </Placeholder>
      </Card.Body>
      <Card.Footer>
        <Placeholder.Button variant='primary' xs={6} />
      </Card.Footer>
    </Card>
  );
};

const CardLoading = () => {
  const numberOfCards = 3;
  const cards = Array.from({ length: numberOfCards }, (_, index) => <CardItem key={index} />);
  return <>{cards}</>;
};

export default CardLoading;
