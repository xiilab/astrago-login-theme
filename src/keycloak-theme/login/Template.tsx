/**
 * Template.tsx - Keycloak 로그인 페이지 공통 레이아웃 템플릿
 *
 * ============================================================================
 * 컴포넌트 흐름 (Component Flow)
 * ============================================================================
 *
 * 1. [kcContext.ts] - Keycloak 컨텍스트 타입 및 Mock 데이터 정의
 *    ↓
 * 2. [KcApp.tsx] - pageId에 따라 적절한 페이지 컴포넌트 선택
 *    ↓
 * 3. [Template.tsx] ← 현재 파일
 *    - 모든 로그인 관련 페이지의 공통 레이아웃 래퍼
 *    - Keycloakify의 기본 CSS 클래스 적용
 *    - "다른 방법으로 로그인" 폼 제공
 *    - 추가 정보 영역(infoNode) 렌더링
 *    ↓
 * 4. [Login.tsx] - children으로 전달되어 실제 로그인 UI 렌더링
 *
 * ============================================================================
 * Props 설명
 * ============================================================================
 *
 * - displayInfo: 추가 정보 영역(infoNode) 표시 여부
 * - displayWide: 넓은 레이아웃 사용 (소셜 로그인 존재 시)
 * - showAnotherWayIfPresent: "다른 방법으로 로그인" 링크 표시 여부
 * - infoNode: 추가 정보를 표시할 React 노드
 * - kcContext: Keycloak 서버에서 전달받은 컨텍스트
 * - i18n: 다국어 지원 객체
 * - doUseDefaultCss: Keycloak 기본 CSS 사용 여부
 * - classes: 커스텀 CSS 클래스 오버라이드
 * - children: 실제 페이지 콘텐츠 (Login.tsx 등)
 */

import { clsx } from 'keycloakify/tools/clsx';
import { usePrepareTemplate } from 'keycloakify/lib/usePrepareTemplate';
import { type TemplateProps } from 'keycloakify/login/TemplateProps';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { KcContext } from './kcContext';
import type { I18n } from './i18n';
import styled from '@emotion/styled';

// ============================================================================
// Types
// ============================================================================

interface CustomTemplateProps extends TemplateProps<KcContext, I18n> {}

// ============================================================================
// Main Component
// ============================================================================

export default function Template(props: CustomTemplateProps) {
  const {
    displayInfo = false,
    displayWide = false,
    showAnotherWayIfPresent = true,
    infoNode = null,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  } = props;

  // ============================================================================
  // Hooks
  // ============================================================================

  /**
   * useGetClassName: Keycloakify의 CSS 클래스 유틸리티
   * - doUseDefaultCss가 true이면 Keycloak 기본 CSS 클래스 사용
   * - classes로 특정 클래스 오버라이드 가능
   */
  const { getClassName } = useGetClassName({ doUseDefaultCss, classes });

  /** i18n.msg: Keycloak 메시지 번역 함수 */
  const { msg } = i18n;

  /**
   * kcContext에서 필요한 속성 추출
   * - auth: 인증 관련 정보 (다른 인증 방법 링크 표시 여부 등)
   * - url: Keycloak URL 정보 (로그인 액션 URL 등)
   */
  const { auth, url } = kcContext;

  /**
   * usePrepareTemplate: 템플릿 초기화 훅
   * - Keycloak 기본 테마 리소스 로드
   * - HTML/Body 클래스 설정
   * - isReady가 true가 될 때까지 렌더링 대기
   */
  const { isReady } = usePrepareTemplate({
    doFetchDefaultThemeResources: doUseDefaultCss,
    styles: [],
    htmlClassName: getClassName('kcHtmlClass'),
    bodyClassName: getClassName('kcBodyClass'),
  });

  // 템플릿 준비가 완료되지 않으면 렌더링하지 않음
  if (!isReady) {
    return null;
  }

  // ============================================================================
  // Render Helpers
  // ============================================================================

  /**
   * "다른 방법으로 로그인" 폼 렌더링
   *
   * Keycloak은 여러 인증 방식을 지원 (비밀번호, OTP, WebAuthn 등)
   * 사용자가 다른 인증 방법을 선택할 수 있는 링크 제공
   *
   * 표시 조건:
   * - auth가 정의되어 있고
   * - auth.showTryAnotherWayLink가 true이고
   * - showAnotherWayIfPresent prop이 true일 때
   */
  const renderTryAnotherWayForm = () => {
    if (!auth?.showTryAnotherWayLink || !showAnotherWayIfPresent) {
      return null;
    }

    return (
      <form
        id="kc-select-try-another-way-form"
        action={url.loginAction}
        method="post"
        className={clsx(displayWide && getClassName('kcContentWrapperClass'))}>
        <div
          className={clsx(
            displayWide && [
              getClassName('kcFormSocialAccountContentClass'),
              getClassName('kcFormSocialAccountClass'),
            ],
          )}>
          <div className={getClassName('kcFormGroupClass')}>
            {/* 폼 제출 시 tryAnotherWay=on 전송 */}
            <input type="hidden" name="tryAnotherWay" value="on" />
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" id="try-another-way" onClick={handleTryAnotherWayClick}>
              {msg('doTryAnotherWay')}
            </a>
          </div>
        </div>
      </form>
    );
  };

  /**
   * 추가 정보 영역 렌더링
   *
   * displayInfo가 true이고 infoNode가 제공되면
   * 로그인 폼 아래에 추가 정보를 표시
   * (예: 회원가입 링크, 도움말 등)
   */
  const renderInfoSection = () => {
    if (!displayInfo) {
      return null;
    }

    return (
      <div id="kc-info" className={getClassName('kcSignUpClass')}>
        <div
          id="kc-info-wrapper"
          className={getClassName('kcInfoAreaWrapperClass')}>
          {infoNode}
        </div>
      </div>
    );
  };

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * "다른 방법으로 로그인" 클릭 핸들러
   * - 폼을 프로그래밍 방식으로 제출
   * - 기본 앵커 동작 방지
   */
  const handleTryAnotherWayClick = () => {
    document.forms['kc-select-try-another-way-form' as never].submit();
    return false;
  };

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <Container>
      {/* Keycloak 기본 로그인 클래스 적용 */}
      <div className={getClassName('kcLoginClass')}>
        <ContentWrapper>
          {/* 넓은 레이아웃 모드일 때 추가 클래스 적용 */}
          <div
            className={clsx(
              displayWide && getClassName('kcFormCardAccountClass'),
            )}>
            {/* Keycloak 콘텐츠 영역 */}
            <div id="kc-content">
              <div id="kc-content-wrapper">
                {/* 실제 페이지 콘텐츠 (Login.tsx 등) */}
                {children}

                {/* 다른 인증 방법 선택 폼 */}
                {renderTryAnotherWayForm()}

                {/* 추가 정보 영역 */}
                {renderInfoSection()}
              </div>
            </div>
          </div>
        </ContentWrapper>
      </div>
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
`;
