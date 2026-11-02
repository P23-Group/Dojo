import { useState } from 'react';
import './App.css';
import { Button, Input, Card } from './components';

function App() {
  const [email, setEmail] = useState('');
  const [clicks, setClicks] = useState(0);

  const handleCancel = () => {
    console.log('Скасовано');
  };

  return (
    <>
      
      <h2 style={{ margin: '15px' }}>Buttons: default</h2>
      <div className="test-row">
        <Button>Зберегти</Button>
        <Button variant="secondary" onClick={handleCancel}>Скасувати</Button>
        <Button variant="tertiary">Пропустити</Button>
      </div>

      <h2 style={{ margin: '15px' }}>Buttons: disabled</h2>
      <div className="test-row">
        <Button disabled>Зберегти</Button>
        <Button variant="secondary" onClick={handleCancel} disabled>Скасувати</Button>
        <Button variant="tertiary" disabled>Пропустити</Button>
      </div>

      <h2 style={{ margin: '15px' }}>Buttons: fullWidth + onClick</h2>
      <div className="test-row">
        <Button fullWidth onClick={() => setClicks(clicks + 1)}>
          Натиснуто: {clicks}
        </Button>
      </div>

      
      <h2 style={{ margin: '15px' }}>Inputs</h2>
      <div className="test-row">
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          value="alex@dojo.app"
          readOnly
          label="Filled"
        />
      </div>
      <div className="test-row">
        <Input
          label="Error"
          defaultValue="wrong"
          error="Please enter a valid email"
        />
        <Input label="Disabled" placeholder="Недоступно" disabled />
        <Input label="Password" type="password" placeholder="••••••••" />
      </div>

      
      <h2 style={{ margin: '15px' }}>Cards</h2>
      <div className="test-row">
        <Card>Звичайна картка</Card>
        <Card title="Клікабельна" onClick={() => console.log('Card click')}>
          Наведи курсор і натисни
        </Card>
      </div>
    </>
  );
}

export default App;
