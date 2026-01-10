import { createRoot } from "react-dom/client";
import { StrictMode, lazy, Suspense } from "react";
import { KcPage, type KcContext } from "./keycloak-theme/kc.gen";

// ============================================================
// 🔧 개발 모드 테스트 설정
// 아래 블록을 주석 처리하면 개발 서버에서 main.app.tsx가 렌더링됩니다
// 주석 해제된 상태면 로그인 페이지를 미리볼 수 있습니다
// ============================================================
import { getKcContextMock } from "./keycloak-theme/login/KcPageStory";

if (import.meta.env.DEV) {
  window.kcContext = getKcContextMock({
    pageId: "login.ftl",  // 테스트할 페이지: "login.ftl", "register.ftl", etc.
    overrides: {
      // 필요시 오버라이드 데이터 추가
      // locale: { currentLanguageTag: "ko" },
    }
  });
}
// ============================================================

// 앱 엔트리포인트 (Keycloak 테마가 아닐 때)
const AppEntrypoint = lazy(() => import("./main.app"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {window.kcContext ? (
      <KcPage kcContext={window.kcContext} />
    ) : (
      <Suspense fallback={<div>Loading...</div>}>
        <AppEntrypoint />
      </Suspense>
    )}
  </StrictMode>
);

declare global {
  interface Window {
    kcContext?: KcContext;
  }
}
