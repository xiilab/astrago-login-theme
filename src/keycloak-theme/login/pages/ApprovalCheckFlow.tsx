import { useEffect } from 'react';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { I18n } from '../i18n';
import styled from '@emotion/styled';

import Footer from '../../Footer';

export default function ApprovalCheckFlow(props: PageProps<any, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  console.log('ApprovalCheckFlow kcContext:', kcContext);

  // URL 파라미터에서 승인 상태 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const approvalStatus = urlParams.get('approvalYN');
    const redirectUrl = urlParams.get('redirect_uri');
    const clientId = urlParams.get('client_id');
    const sessionCode = urlParams.get('session_code');
    const tabId = urlParams.get('tab_id');

    console.log('URL params:', {
      approvalStatus,
      redirectUrl,
      clientId,
      sessionCode,
      tabId,
    });
    console.log('Current URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);

    // 개발 환경에서 직접 접근 시 처리
    if (window.location.pathname.includes('post-broker-login')) {
      console.log('Post Broker Login 경로 감지됨');

      // 세션이 없는 경우 로그인 페이지로 리다이렉션
      if (!sessionCode && !tabId) {
        console.log('세션 정보가 없어 로그인 페이지로 리다이렉션');
        window.location.href = '/auth/realms/astrago/login';
        return;
      }
    }

    // 승인 상태에 따른 처리
    if (approvalStatus === 'Y') {
      // 승인 완료 시 리다이렉션
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else if (clientId) {
        // 기본 리다이렉션 URL 생성
        const baseUrl = window.location.origin;
        window.location.href = `${baseUrl}/auth/realms/astrago/account`;
      }
    }
  }, []);

  const handleBackToLogin = () => {
    // 로그인 페이지로 돌아가기
    window.location.href = '/auth/realms/astrago/login';
  };

  return (
    <>
      <Wrapper>
        <Container>
          <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayMessage={true}
            headerNode="승인 대기">
            <Section>
              {/* <Title>
                <BlackLogo />
              </Title> */}
              {/* <SubTitle>승인 대기</SubTitle>
              <Description>
                관리자의 승인을 기다리고 있습니다.
                <br />
                승인 완료 후 로그인하실 수 있습니다.
              </Description> */}

              <div id="kc-form">
                <div id="kc-form-wrapper">
                  {kcContext.approvalYN === 'N' && (
                    <ApprovalPendingContent>
                      <PendingIcon>⏳</PendingIcon>
                      <PendingTitle>승인 대기 중</PendingTitle>
                      <PendingMessage>
                        관리자가 계정을 검토하고 있습니다.
                        <br />
                        승인 완료 시 이메일로 알려드립니다.
                      </PendingMessage>
                      <ContactInfo>
                        <ContactTitle>
                          문의사항이 있으시면
                          <br />
                          <br />
                          주관 담당자에게 문의 부탁드립니다.
                        </ContactTitle>
                      </ContactInfo>
                      <BackButtonWrapper>
                        <BackButton onClick={handleBackToLogin}>
                          로그인으로 돌아가기
                        </BackButton>
                      </BackButtonWrapper>
                    </ApprovalPendingContent>
                  )}
                </div>
              </div>
            </Section>
          </Template>
          <FooterWrapper>
            <Footer />
          </FooterWrapper>
        </Container>
      </Wrapper>
    </>
  );
}

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Container = styled('div')`
  position: relative;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Section = styled('div')`
  margin: 0 auto;
  width: 380px;
`;

const ApprovalPendingContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
`;

const PendingIcon = styled('div')`
  font-size: 48px;
  margin-bottom: 24px;
`;

const PendingTitle = styled('div')`
  color: #005eb8;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const PendingMessage = styled('div')`
  color: #17171f;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 32px;
`;

const ContactInfo = styled('div')`
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
`;

const ContactTitle = styled('div')`
  color: #17171f;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const BackButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const BackButton = styled('button')`
  background: transparent;
  border: 1px solid #d5d4d8;
  color: #17171f;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
    border-color: #005eb8;
  }
`;

const FooterWrapper = styled('div')`
  position: absolute;
  bottom: 0;
`;
