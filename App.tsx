import React, { useState } from 'react';

// Tauri APIはグローバルオブジェクト window.__TAURI__ を介して利用します。
// これにより、 'import' に起因するビルドエラーを回避します。

function App() {
  const [classroom, setClassroom] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    // 教室名が空かチェック
    if (!classroom.trim()) {
      setMessage('教室名を入力してください');
      return;
    }

    setIsLoading(true);
    setMessage(`教室「${classroom}」で測定を開始します...`);

    try {
      // window.__TAURI__.tauri.invoke が存在するか確認し、Tauri環境でのみ実行
      // @ts-ignore -  __TAURI__ はTauri環境実行時にグローバルに注入されます
      if (window.__TAURI__ && window.__TAURI__.tauri) {
        // Rust側の "start_measurement" コマンドを呼び出す
        // @ts-ignore
        await window.__TAURI__.tauri.invoke('start_measurement', { classroom });
        setMessage(`教室「${classroom}」での測定を開始しました！`);
      } else {
        // Tauri環境外で実行された場合のフォールバック処理
        console.warn("Tauri API not found. Running in simulation mode.");
        // 開発用にAPI呼び出しをシミュレートします
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMessage(`シミュレーション完了: 教室「${classroom}」での測定が完了しました。(Tauri環境外)`);
      }
    } catch (error) {
      console.error("測定開始エラー:", error);
      setMessage('測定の開始に失敗しました。コンソールで詳細を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  // スタイル定義
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      backgroundColor: '#f7fafc',
    },
    card: {
      padding: '40px',
      textAlign: 'center',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      backgroundColor: 'white',
    } as const,
    heading: {
      marginBottom: '32px',
      fontSize: '24px',
      fontWeight: '600',
    },
    formControl: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      textAlign: 'left',
    } as const,
    input: {
      width: '300px',
      padding: '10px 12px',
      border: '2px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
    },
    button: {
      padding: '12px 32px',
      backgroundColor: '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
    },
    buttonDisabled: {
      backgroundColor: '#a0aec0',
      cursor: 'not-allowed',
    },
    message: {
      marginTop: '24px',
      color: '#2b6cb0',
      fontWeight: '500',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Wi-Fi アクセスポイント測定</h1>
        
        <div style={styles.formControl}>
          <label htmlFor="classroom-input" style={styles.label}>
            現在いる教室名：
          </label>
          <input
            id="classroom-input"
            type="text"
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
            placeholder="例: 101教室"
            style={styles.input}
          />
        </div>

        <button
          onClick={handleStart}
          style={{
            ...styles.button,
            ...(isLoading ? styles.buttonDisabled : {})
          }}
          disabled={isLoading}
        >
          {isLoading ? '測定中...' : '測定開始'}
        </button>

        {message && (
          <p style={styles.message}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
