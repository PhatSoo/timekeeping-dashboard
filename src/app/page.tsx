import Card from '@/components/App.CardItem';

const data = [
  { title: 'Employees', content: 20 },
  { title: 'Shifts', content: 3 },
];

const App = () => {
  const date = new Date();

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedDate = date.toLocaleDateString('vi-VN', options as Intl.DateTimeFormatOptions);
  return (
    <>
      <div className='fs-4 fw-bold text-dark text-center p-4 bg-light border border-2 border-secondary rounded-3'>{formattedDate}</div>

      <div className='d-flex p-5 gap-5 flex-wrap'>
        {data.map((item, idx) => (
          <Card key={idx} Title={item.title} Content={item.content} />
        ))}
      </div>
    </>
  );
};

export default App;
