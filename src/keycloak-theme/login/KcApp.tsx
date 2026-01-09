/**
 * KcApp.tsx - Keycloak 테마 애플리케이션 엔트리 포인트
 *
 * ============================================================================
 * 컴포넌트 흐름 (Component Flow)
 * ============================================================================
 *
 * 1. [kcContext.ts] - Keycloak 컨텍스트 타입 및 Mock 데이터 정의
 *    ↓
 * 2. [KcApp.tsx] ← 현재 파일
 *    - Keycloak 테마의 메인 엔트리 포인트
 *    - pageId에 따라 적절한 페이지 컴포넌트 라우팅
 *    - i18n(다국어) 초기화
 *    - React.lazy를 통한 코드 스플리팅
 *    ↓
 * 3. [Template.tsx] - 공통 레이아웃 래퍼
 *    ↓
 * 4. [Login.tsx 등] - 실제 페이지 UI 렌더링
 *
 * ============================================================================
 * Keycloak 페이지 식별자 (pageId)
 * ============================================================================
 *
 * Keycloak은 다양한 인증 관련 페이지를 제공하며,
 * 각 페이지는 고유한 pageId로 식별됩니다:
 *
 * - login.ftl: 로그인 페이지 (가장 일반적)
 * - register.ftl: 회원가입 페이지
 * - login-reset-password.ftl: 비밀번호 재설정 페이지
 * - login-otp.ftl: OTP 인증 페이지
 * - login-update-password.ftl: 비밀번호 변경 페이지
 * - login-verify-email.ftl: 이메일 인증 페이지
 * - error.ftl: 에러 페이지
 * - info.ftl: 정보 페이지
 *
 * 커스텀 테마에서 처리하지 않는 pageId는 Keycloakify의
 * Fallback 컴포넌트가 기본 테마로 렌더링합니다.
 */

import './KcApp.css';
import { lazy, Suspense } from 'react';
import Fallback, { type PageProps } from 'keycloakify/login';
import type { KcContext } from './kcContext';
import { useI18n } from './i18n';

// ============================================================================
// Lazy-loaded Components (코드 스플리팅)
// ============================================================================

/**
 * React.lazy를 사용한 동적 임포트
 * - 초기 번들 크기 감소
 * - 필요한 페이지만 로드하여 성능 최적화
 */
const Template = lazy(() => import('./Template'));
const Login = lazy(() => import('./pages/Login'));

// ============================================================================
// CSS Classes Configuration
// ============================================================================

/**
 * Keycloak 기본 CSS 클래스 오버라이드
 *
 * PageProps의 classes 속성을 통해 Keycloak 기본 클래스를
 * 커스텀 클래스로 대체하거나 추가할 수 있습니다.
 *
 * 주요 클래스:
 * - kcHtmlClass: HTML 루트 요소 클래스
 * - kcBodyClass: Body 요소 클래스
 * - kcHeaderWrapperClass: 헤더 래퍼 클래스
 * - kcLoginClass: 로그인 컨테이너 클래스
 * - kcFormGroupClass: 폼 그룹 클래스
 */
const customClasses: PageProps<KcContext, any>['classes'] = {
  kcHtmlClass: 'my-root-class',
  kcHeaderWrapperClass: 'my-color my-font',
};

// ============================================================================
// Main Component
// ============================================================================

interface KcAppProps {
  kcContext: KcContext;
}

export default function KcApp(props: KcAppProps) {
  const { kcContext } = props;

  // ============================================================================
  // Hooks
  // ============================================================================

  /**
   * useI18n: Keycloakify의 다국어 지원 훅
   *
   * - kcContext.locale에 따라 적절한 번역 로드
   * - 로딩 중에는 null 반환
   * - 완료 시 msg, msgStr 등의 번역 함수 제공
   *
   * 반환값:
   * - msg(key): 번역된 메시지를 React 노드로 반환
   * - msgStr(key): 번역된 메시지를 문자열로 반환
   * - currentLanguageTag: 현재 언어 태그 (예: 'ko', 'en')
   */
  const i18n = useI18n({ kcContext });

  // i18n 로딩 중에는 아무것도 렌더링하지 않음
  if (i18n === null) {
    return null;
  }

  // ============================================================================
  // Page Routing
  // ============================================================================

  /**
   * pageId에 따른 페이지 컴포넌트 선택
   *
   * kcContext.pageId는 Keycloak 서버가 현재 표시할 페이지를 알려줍니다.
   * 커스텀 테마에서 처리할 페이지는 case로 추가하고,
   * 나머지는 default에서 Fallback으로 처리합니다.
   */
  const renderPage = () => {
    switch (kcContext.pageId) {
      /**
       * 로그인 페이지 (login.ftl)
       * - 가장 기본적인 인증 페이지
       * - 이메일/비밀번호 입력 및 소셜 로그인 제공
       */
      case 'login.ftl':
        return (
          <Login
            kcContext={kcContext}
            i18n={i18n}
            Template={Template}
            classes={customClasses}
            doUseDefaultCss={true}
          />
        );

      /**
       * 기본 Fallback 처리
       *
       * 커스텀 테마에서 명시적으로 처리하지 않는 pageId는
       * Keycloakify의 Fallback 컴포넌트가 기본 테마로 렌더링
       *
       * 추가 페이지 커스터마이징 시 case 추가:
       * case 'register.ftl':
       *   return <Register {...commonProps} />;
       */
      default:
        return (
          <Fallback
            kcContext={kcContext}
            i18n={i18n}
            Template={Template}
            classes={customClasses}
            doUseDefaultCss={true}
          />
        );
    }
  };

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    /**
     * Suspense: lazy-loaded 컴포넌트의 로딩 상태 처리
     *
     * fallback prop을 지정하여 로딩 중 표시할 UI 설정 가능
     * 현재는 빈 fallback으로 깔끔한 로딩 처리
     *
     * 예시: fallback={<LoadingSpinner />}
     */
    <Suspense fallback={null}>{renderPage()}</Suspense>
  );
}
