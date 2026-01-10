/**
 * Template.tsx - Keycloak 로그인 페이지 공통 레이아웃 템플릿
 * Keycloakify 11.x 마이그레이션 버전
 */

import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import styled from "@emotion/styled";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  } = props;

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
  const { msg, msgStr } = i18n;
  const { auth, url, realm, locale } = kcContext;

  useEffect(() => {
    document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
  }, [documentTitle, realm.displayName]);

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  useSetClassName({
    qualifiedName: "html",
    className: kcClsx("kcHtmlClass"),
  });

  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? kcClsx("kcBodyClass"),
  });

  if (!isReadyToRender) {
    return null;
  }

  // "다른 방법으로 로그인" 폼 렌더링
  const renderTryAnotherWayForm = () => {
    if (!auth?.showTryAnotherWayLink) {
      return null;
    }

    return (
      <form
        id="kc-select-try-another-way-form"
        action={url.loginAction}
        method="post"
      >
        <div className={kcClsx("kcFormGroupClass")}>
          <input type="hidden" name="tryAnotherWay" value="on" />
          <a
            href="#"
            id="try-another-way"
            onClick={(e) => {
              e.preventDefault();
              document.forms["kc-select-try-another-way-form" as never].submit();
            }}
          >
            {msg("doTryAnotherWay")}
          </a>
        </div>
      </form>
    );
  };

  return (
    <Container>
      <div className={kcClsx("kcLoginClass")}>
        <ContentWrapper>
          <div>
            <div id="kc-content">
              <div id="kc-content-wrapper">
                {children}
                {renderTryAnotherWayForm()}
              </div>
            </div>
          </div>
        </ContentWrapper>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  margin: 0 auto;
`;
