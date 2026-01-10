/**
 * 앱 엔트리포인트 - Keycloak 테마가 아닐 때 렌더링되는 컴포넌트
 *
 * 개발 중에 테마 미리보기를 위한 용도
 */

export default function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Pretendard, sans-serif'
    }}>
      <h1>AstraGo Login Theme</h1>
      <p>이 페이지는 Keycloak 테마가 로드되지 않았을 때 표시됩니다.</p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        개발 모드에서 테마를 테스트하려면 src/main.tsx의 mock 블록 주석을 해제하세요.
      </p>
    </div>
  );
}
