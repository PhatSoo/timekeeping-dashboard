import { Image } from 'react-bootstrap';

const InfoBottom = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: 10, borderColor: 'black' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ borderRadius: '50%' }}>
          <Image alt='avatar' src='https://cdn-icons-png.flaticon.com/512/103/103945.png' width='50' height='50' />
        </div>
      </div>
      <div className='px-2' style={{ flex: 1 }}>
        <div>Lê Trung Phát</div>
        <div>phat.ltrung@mail.com</div>
      </div>
    </div>
  );
};

export default InfoBottom;
