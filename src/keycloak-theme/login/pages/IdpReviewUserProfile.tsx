import { useState, type FormEventHandler } from 'react';
import { clsx } from 'keycloakify/tools/clsx';
import { useConstCallback } from 'keycloakify/tools/useConstCallback';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';
import styled from '@emotion/styled';

import { ReactComponent as MailIcon } from './icons/mail_outline.svg';
import { ReactComponent as LockIcon } from './icons/lock_outline.svg';
import { ReactComponent as BlackLogo } from './BlackLogo.svg';
import Footer from '../../Footer';

export default function IdpReviewUserProfile(
  props: PageProps<
    Extract<KcContext, { pageId: 'idp-review-user-profile.ftl' }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  console.log(kcContext);

  const { msg } = i18n;

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
            headerNode="프로필 정보 확인">
            <Section>
              <Title>
                <BlackLogo />
              </Title>
              <SubTitle>프로필 정보 확인</SubTitle>
              <Description>
                소셜 로그인을 통해 제공된 정보를 확인하고 필요한 경우
                수정해주세요.
              </Description>

              <div id="kc-form">
                <div id="kc-form-wrapper">
                  <form
                    id="kc-idp-review-user-profile-form"
                    onSubmit={onSubmit}
                    action={kcContext.url.loginAction}
                    method="post">
                    {/* 사용자 프로필 필드들 */}
                    {kcContext.profile?.attributes?.map((attribute) => (
                      <div
                        key={attribute.name}
                        className={getClassName('kcFormGroupClass')}>
                        <InputContainer>
                          <MailIcon />
                          <input
                            type="text"
                            id={attribute.name}
                            name={attribute.name}
                            value={attribute.value || ''}
                            placeholder={
                              attribute.displayName || attribute.name
                            }
                            className={getClassName('kcInputClass')}
                            readOnly={attribute.readOnly}
                          />
                        </InputContainer>
                      </div>
                    ))}

                    {/* 제출 버튼 */}
                    <div className={getClassName('kcFormGroupClass')}>
                      <SubmitButtonWrapper>
                        <SubmitButton>
                          <input
                            type="submit"
                            name="submitAction"
                            id="kc-submit"
                            value="확인"
                            disabled={isSubmitButtonDisabled}
                          />
                        </SubmitButton>
                      </SubmitButtonWrapper>
                    </div>
                  </form>
                </div>
              </div>
            </Section>
          </Template>
          <FooterWrapper>
            <Footer i18n={i18n} />
          </FooterWrapper>
        </Container>
      </Wrapper>
    </>
  );
}

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100;
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

const Title = styled('div')`
  text-align: center;
`;

const SubTitle = styled('div')`
  color: #5b29c7;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  line-height: 25px;
  margin: 32px 0 16px 0;
`;

const Description = styled('div')`
  color: #90919e;
  font-size: 12px;
  text-align: center;
  line-height: 18px;
  margin-bottom: 32px;
`;

const InputContainer = styled('div')`
  background-color: #ffffff;
  border: 1px solid #d5d4d8;
  height: 48px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 22px 0 20px;
  gap: 10px;
  transition: all 0.5s ease;
  margin-bottom: 16px;

  &:focus-within {
    border: 1px solid #5b29c7;
  }

  input {
    width: 360px;
    height: 28px;
    background: transparent;
    border-color: transparent;
    color: #17171f;
  }

  input::placeholder {
    size: 14px;
    font-style: normal;
    color: #90919e;
  }

  input:focus {
    outline: none;
  }

  input:read-only {
    background-color: #f8f8f8;
    color: #90919e;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: #17171f;
    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
    box-shadow: 0 0 0px 1000px #ffffff inset;
    transition: background-color 5000s ease-in-out 0s;
  }
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

const FooterWrapper = styled('div')`
  position: absolute;
  bottom: 0;
`;
