import React from 'react';
import { Placeholder, Table } from 'react-bootstrap';

interface IProp {
  columns: string[];
}

const TableLoading = ({ columns }: IProp) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {columns.map((item, idx) => (
            <th key={idx}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={index}>
            {columns.map((_, idx) => (
              <td key={idx}>
                <Placeholder as='div' animation='glow'>
                  <Placeholder xs={6} />
                </Placeholder>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableLoading;
