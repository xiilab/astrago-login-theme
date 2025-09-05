import { useState, type FormEventHandler } from 'react';
import { useConstCallback } from 'keycloakify/tools/useConstCallback';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';
import styled from '@emotion/styled';

import Footer from '../../Footer';

export default function ApprovalCheckFlow(
  props: PageProps<
    Extract<KcContext, { pageId: 'approval_check_flow.ftl' }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  console.log(kcContext);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

  const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();
    setIsSubmitButtonDisabled(true);

    const formElement = e.target as HTMLFormElement;
    formElement.submit();
  });

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
                        <BackButton onClick={() => window.history.back()}>
                          이전
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

const ApprovalApprovedContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
`;

const ApprovedIcon = styled('div')`
  font-size: 48px;
  margin-bottom: 24px;
`;

const ApprovedTitle = styled('div')`
  color: #28a745;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const ApprovedMessage = styled('div')`
  color: #17171f;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 32px;
`;

const SubmitButtonWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 32px;
`;

const SubmitButton = styled('button')`
  width: 380px;
  height: 54px;
  border-radius: 12px;
  background: #5b29c7;
  border: none;
  cursor: pointer;

  input {
    background: transparent;
    border: none;
    color: #ffffff;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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
