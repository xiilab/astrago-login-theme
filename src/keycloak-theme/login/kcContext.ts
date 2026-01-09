/**
 * kcContext.ts - Keycloak Context 설정
 *
 * 이 파일은 Keycloakify의 컨텍스트 설정을 담당합니다.
 *
 * ============================================================================
 * 컴포넌트 흐름 (Component Flow)
 * ============================================================================
 *
 * 1. [kcContext.ts] - Keycloak 서버로부터 전달받는 데이터 타입 및 Mock 데이터 정의
 *    ↓
 * 2. [KcApp.tsx] - 페이지 라우팅 및 컴포넌트 선택
 *    ↓
 * 3. [Template.tsx] - 공통 레이아웃 래퍼
 *    ↓
 * 4. [Login.tsx] - 실제 로그인 UI 렌더링
 *
 * ============================================================================
 * KcContext 주요 속성
 * ============================================================================
 *
 * Keycloak 서버가 테마에 전달하는 데이터 구조:
 *
 * - pageId: 현재 페이지 식별자 (예: 'login.ftl', 'register.ftl')
 * - locale: 언어 설정 (currentLanguageTag: 'ko', 'en' 등)
 * - realm: Keycloak Realm 설정
 *   - name: Realm 이름
 *   - registrationAllowed: 회원가입 허용 여부
 *   - resetPasswordAllowed: 비밀번호 재설정 허용 여부
 *   - password: 비밀번호 인증 활성화 여부
 * - url: Keycloak URL 정보
 *   - loginAction: 로그인 폼 제출 URL
 *   - loginResetCredentialsUrl: 비밀번호 재설정 URL
 *   - registrationUrl: 회원가입 URL
 * - login: 이전 로그인 시도 정보
 *   - username: 저장된 사용자명
 * - social: 소셜 로그인 설정
 *   - providers: 소셜 로그인 제공자 목록 (Google, GitHub 등)
 *   - displayInfo: 소셜 로그인 정보 표시 여부
 * - auth: 인증 관련 정보
 *   - selectedCredential: 선택된 인증 방식
 *   - showTryAnotherWayLink: 다른 인증 방법 링크 표시 여부
 * - message: Keycloak 서버 메시지
 *   - type: 메시지 유형 ('error', 'warning', 'info', 'success')
 *   - summary: 메시지 내용
 */

import { createGetKcContext } from 'keycloakify/login';

// ============================================================================
// Mock 데이터 설정
// ============================================================================

/**
 * createGetKcContext: Keycloakify에서 제공하는 컨텍스트 생성 함수
 *
 * mockData: 개발 환경에서 사용할 Mock 데이터
 * - 실제 Keycloak 서버 없이 로컬에서 테마 개발 가능
 * - 빌드 시에는 실제 Keycloak 서버의 데이터로 대체됨
 */
export const { getKcContext } = createGetKcContext({
  mockData: [
    {
      pageId: 'login.ftl',
      locale: {
        currentLanguageTag: 'ko',
      },
      // 개발 시 추가 Mock 데이터 예시:
      // message: {
      //   type: 'error',
      //   summary: '이메일 또는 비밀번호가 올바르지 않습니다.',
      // },
      // realm: {
      //   registrationAllowed: true,
      //   resetPasswordAllowed: true,
      // },
    },
  ],
});

// ============================================================================
// Context 인스턴스 및 타입 내보내기
// ============================================================================

/**
 * kcContext: 현재 활성화된 Keycloak 컨텍스트 인스턴스
 *
 * mockPageId: 개발 모드에서 렌더링할 페이지
 * - 개발 중에는 이 값으로 특정 페이지를 테스트
 * - 프로덕션에서는 Keycloak 서버가 실제 pageId를 제공
 */
export const { kcContext } = getKcContext({
  // mockPageId: 'login.ftl',
});

/**
 * KcContext 타입: 컨텍스트의 TypeScript 타입 정의
 *
 * NonNullable: null이 아닌 값만 허용
 * - getKcContext의 반환값에서 kcContext 속성의 타입 추출
 * - 다른 컴포넌트에서 타입 안전성을 위해 사용
 */
export type KcContext = NonNullable<
  ReturnType<typeof getKcContext>['kcContext']
>;
