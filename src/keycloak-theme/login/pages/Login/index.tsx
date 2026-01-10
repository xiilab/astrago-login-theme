/**
 * Login 페이지 - Keycloak 로그인 메인 컴포넌트
 * Keycloakify 11.x
 */
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../KcContext";
import type { I18n } from "../../i18n";

// Components
import { LoginForm } from "./LoginForm";
import { Footer } from "../../components/Footer";

// Hooks
import { useLoginForm } from "./hooks";

// Icons
import LogoIcon from "../../icons/login-icon.svg?react";
import backgroundImage from "../../icons/background.svg";

// Styles
import {
  PageContainer,
  FormPanel,
  FormPanelContent,
  BackgroundPanel,
  LoginFormWrapper,
  Header,
  LogoWrapper,
  PageTitle,
  PageSubtitle,
} from "./styles";

type LoginProps = PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>;

export default function Login(props: LoginProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { social } = kcContext;

  const form = useLoginForm(kcContext);

  return (
    <PageContainer>
      <FormPanel>
        <FormPanelContent>
          <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={social?.displayInfo}
            headerNode={<></>}
          >
            <LoginFormWrapper>
              {/* 헤더 */}
              <Header>
                <LogoWrapper>
                  <LogoIcon aria-hidden="true" />
                </LogoWrapper>
                <PageTitle>Log in</PageTitle>
              </Header>
              <PageSubtitle>세상의 모든 GPU, AstraGo로 관리해 보세요.</PageSubtitle>

              {/* 로그인 폼 */}
              <LoginForm
                kcContext={kcContext}
                i18n={i18n}
                doUseDefaultCss={doUseDefaultCss}
                classes={classes}
                form={form}
              />
            </LoginFormWrapper>
          </Template>
        </FormPanelContent>

        {/* 푸터 */}
        <Footer />
      </FormPanel>

      <BackgroundPanel $backgroundUrl={backgroundImage} aria-hidden="true" />
    </PageContainer>
  );
}
