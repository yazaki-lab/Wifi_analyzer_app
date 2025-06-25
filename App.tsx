import React, { useState } from 'react';

function App() {
  const [classroom, setClassroom] = useState('');
  const [message, setMessage] = useState('');

  const handleStart = () => {
    if (!classroom.trim()) {
      setMessage('教室名を入力してください');
      return;
    }
    setMessage(`教室「${classroom}」で測定を開始します...`);
    // ここでRust側に測定開始をinvokeするコードをあとで追加します
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Wi-Fi アクセスポイント測定</h1>
      <label>
        現在いる教室名：
        <input
          type="text"
          value={classroom}
          onChange={(e) => setClassroom(e.target.value)}
          placeholder="例: 101教室"
          style={{ marginLeft: 8, padding: 4 }}
        />
      </label>
      <br /><br />
      <button onClick={handleStart} style={{ padding: '8px 16px' }}>
        測定開始
      </button>
      <p style={{ marginTop: 16, color: 'blue' }}>{message}</p>
    </div>
  );
}

export default App;
