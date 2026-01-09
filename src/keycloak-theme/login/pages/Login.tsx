/**
 * Login.tsx - Keycloak 로그인 페이지
 *
 * Keycloak Context 주요 속성:
 * - social: 소셜 로그인 설정 (Google, GitHub 등)
 * - realm: Keycloak Realm 설정 (비밀번호 정책, 등록 허용 여부 등)
 * - url: Keycloak URL (로그인 액션, 비밀번호 재설정 등)
 * - login: 이전 로그인 시도 정보 (저장된 username 등)
 * - auth: 인증 관련 정보 (선택된 credential 등)
 * - message: Keycloak 서버 메시지 (에러, 경고 등)
 */

/* React */
import { useState, type FormEventHandler } from 'react';

/* Keycloakify */
import { clsx } from 'keycloakify/tools/clsx';
import { useConstCallback } from 'keycloakify/tools/useConstCallback';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';

/* Styling */
import styled from '@emotion/styled';

/* Assets */
import { ReactComponent as MailIcon } from './icons/mail.svg';
import { ReactComponent as LockIcon } from './icons/lock.svg';
import { ReactComponent as EyeOpenIcon } from './icons/open-eye.svg';
import { ReactComponent as EyeClosedIcon } from './icons/close-eye.svg';
import { ReactComponent as LogoIcon } from './icons/login-icon.svg';
import { ReactComponent as CheckboxIcon } from './icons/checkbox.svg';
import { ReactComponent as CheckboxCheckedIcon } from './icons/checkbox-checked.svg';
import backgroundImage from './icons/background.svg';

interface LoginProps
  extends PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n> {}

interface PasswordVisibility {
  type: 'password' | 'text';
  isVisible: boolean;
}

export default function Login(props: LoginProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { getClassName } = useGetClassName({ doUseDefaultCss, classes });
  const { social, realm, url, login, auth, registrationDisabled, message } =
    kcContext;
  const { msg } = i18n;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      type: 'password',
      isVisible: false,
    });
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined,
  );
  // Keycloak 서버 에러 (로그인 실패 등) - 입력창 빨간 테두리 없이 텍스트만 표시
  const [serverError, setServerError] = useState<string | undefined>(
    message?.summary,
  );
  /* 아이디 저장 기능 - localStorage에서 저장된 이메일과 체크 상태 불러오기 */
  const [savedEmail] = useState(() => {
    try {
      return localStorage.getItem('savedEmail') || '';
    } catch {
      return '';
    }
  });
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem('rememberMe') === 'true';
    } catch {
      return false;
    }
  });

  /**
   * 폼 제출 핸들러
   * Keycloak은 POST 요청 시 'username' 필드명을 기대하므로 제출 직전에 변경
   */
  const handleSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const formElement = e.target as HTMLFormElement;
      const emailInput = formElement.querySelector(
        "input[name='email']",
      ) as HTMLInputElement;
      const passwordInput = formElement.querySelector(
        "input[name='password']",
      ) as HTMLInputElement;

      // 이메일 유효성 검사
      if (!emailInput?.value.trim()) {
        setIsSubmitting(false);
        setEmailError('이메일을 입력해 주세요.');
        setPasswordError(undefined);
        emailInput?.focus();
        return;
      }

      // 비밀번호 유효성 검사
      if (!passwordInput?.value.trim()) {
        setIsSubmitting(false);
        setEmailError(undefined);
        setPasswordError('비밀번호를 입력해 주세요.');
        passwordInput?.focus();
        return;
      }

      // 아이디 저장 처리
      try {
        if (rememberMe) {
          localStorage.setItem('savedEmail', emailInput.value);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('rememberMe');
        }
      } catch {
        // localStorage 접근 실패 시 무시
      }

      // Keycloak은 'username' 필드명을 기대
      emailInput.setAttribute('name', 'username');
      setEmailError(undefined);
      setPasswordError(undefined);
      formElement.submit();
    },
  );

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prev) => ({
      type: prev.isVisible ? 'password' : 'text',
      isVisible: !prev.isVisible,
    }));
  };

  const clearEmailError = () => setEmailError(undefined);
  const clearPasswordError = () => {
    setPasswordError(undefined);
    setServerError(undefined);
  };

  const hasSocialProviders = realm.password && social.providers !== undefined;

  return (
    <PageContainer>
      <FormPanel>
        <FormPanelContent>
          <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={social.displayInfo}
            displayWide={hasSocialProviders}
            headerNode={msg('doLogIn')}
            infoNode={null}>
            <LoginFormWrapper>
              {/* 헤더 */}
              <Header>
                <LogoWrapper>
                  <LogoIcon aria-hidden="true" />
                </LogoWrapper>
                <PageTitle>Log in</PageTitle>
              </Header>
              <PageSubtitle>
                세상의 모든 GPU, AstraGo로 관리해 보세요.
              </PageSubtitle>

              {/* 로그인 폼 */}
              <div
                id="kc-form"
                className={clsx(
                  hasSocialProviders && getClassName('kcContentWrapperClass'),
                )}>
                <div
                  id="kc-form-wrapper"
                  className={clsx(
                    hasSocialProviders && [
                      getClassName('kcFormSocialAccountContentClass'),
                      getClassName('kcFormSocialAccountClass'),
                    ],
                  )}>
                  {realm.password && (
                    <form
                      id="kc-form-login"
                      onSubmit={handleSubmit}
                      action={url.loginAction}
                      method="post"
                      aria-label="로그인 폼">
                      {/* 이메일 입력 */}
                      <FormGroup className={getClassName('kcFormGroupClass')}>
                        <FieldWrapper>
                          <FieldLabel htmlFor="email">E-mail</FieldLabel>
                          <InputBox hasError={!!emailError}>
                            <InputIcon aria-hidden="true">
                              <MailIcon />
                            </InputIcon>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              tabIndex={1}
                              className={getClassName('kcInputClass')}
                              defaultValue={savedEmail || login.username || ''}
                              placeholder="이메일을 입력해 주세요."
                              autoFocus
                              autoComplete="email"
                              aria-invalid={!!emailError}
                              aria-describedby={
                                emailError ? 'email-error' : undefined
                              }
                              onChange={clearEmailError}
                            />
                          </InputBox>
                          {emailError && (
                            <ErrorMessage id="email-error" role="alert">
                              {emailError}
                            </ErrorMessage>
                          )}
                        </FieldWrapper>
                      </FormGroup>

                      {/* 비밀번호 입력 */}
                      <FormGroup className={getClassName('kcFormGroupClass')}>
                        <FieldWrapper>
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <PasswordInputBox hasError={!!passwordError}>
                            <InputIcon aria-hidden="true">
                              <LockIcon />
                            </InputIcon>
                            <input
                              id="password"
                              name="password"
                              type={passwordVisibility.type}
                              tabIndex={2}
                              className={getClassName('kcInputClass')}
                              placeholder="비밀번호를 입력해 주세요."
                              autoComplete="current-password"
                              aria-invalid={!!passwordError}
                              aria-describedby={
                                passwordError || serverError
                                  ? 'password-error'
                                  : undefined
                              }
                              onChange={clearPasswordError}
                            />
                            <PasswordToggleButton
                              type="button"
                              tabIndex={-1}
                              onClick={togglePasswordVisibility}
                              aria-label={
                                passwordVisibility.isVisible
                                  ? '비밀번호 숨기기'
                                  : '비밀번호 표시'
                              }
                              aria-pressed={passwordVisibility.isVisible}>
                              {passwordVisibility.isVisible ? (
                                <EyeOpenIcon aria-hidden="true" />
                              ) : (
                                <EyeClosedIcon aria-hidden="true" />
                              )}
                            </PasswordToggleButton>
                          </PasswordInputBox>
                          {passwordError && (
                            <ErrorMessage id="password-error" role="alert">
                              {passwordError}
                            </ErrorMessage>
                          )}
                          {!passwordError && serverError && (
                            <ErrorMessage id="password-error" role="alert">
                              {serverError}
                            </ErrorMessage>
                          )}
                        </FieldWrapper>
                      </FormGroup>

                      {/* 로그인 옵션 */}
                      <LoginOptions>
                        <RememberMeButton
                          type="button"
                          onClick={() => setRememberMe(!rememberMe)}
                          aria-pressed={rememberMe}>
                          {rememberMe ? (
                            <CheckboxCheckedIcon
                              style={{ color: '#5B29C7' }}
                              aria-hidden="true"
                            />
                          ) : (
                            <CheckboxIcon aria-hidden="true" />
                          )}
                          <span>아이디 저장</span>
                        </RememberMeButton>

                        {realm.resetPasswordAllowed && (
                          <ForgotPasswordLink
                            href={`${window.location.origin}/reset-password`}>
                            비밀번호를 잊으셨나요?
                          </ForgotPasswordLink>
                        )}
                      </LoginOptions>

                      {/* 로그인 버튼 */}
                      <div
                        id="kc-form-buttons"
                        className={getClassName('kcFormGroupClass')}>
                        {auth?.selectedCredential && (
                          <input
                            type="hidden"
                            name="credentialId"
                            value={auth.selectedCredential}
                          />
                        )}

                        <SubmitButtonWrapper>
                          <SubmitButton
                            type="submit"
                            tabIndex={4}
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}>
                            로그인
                          </SubmitButton>
                        </SubmitButtonWrapper>

                        {realm.password &&
                          realm.registrationAllowed &&
                          !registrationDisabled && (
                            <SignUpPrompt>
                              아직 계정이 없으신가요?
                              <a
                                href={`${window.location.origin}/signup`}
                                tabIndex={6}>
                                회원 가입하기
                              </a>
                            </SignUpPrompt>
                          )}
                      </div>

                      {/* 소셜 로그인 */}
                      {hasSocialProviders && social.providers && (
                        <SocialProviders
                          id="kc-social-providers"
                          className={clsx(
                            getClassName('kcFormSocialAccountContentClass'),
                            getClassName('kcFormSocialAccountClass'),
                          )}
                          aria-label="소셜 로그인">
                          <ul
                            className={clsx(
                              getClassName('kcFormSocialAccountListClass'),
                              social.providers.length > 4 &&
                                getClassName(
                                  'kcFormSocialAccountDoubleListClass',
                                ),
                            )}>
                            {social.providers.map((provider) => (
                              <li
                                key={provider.providerId}
                                className={getClassName(
                                  'kcFormSocialAccountListLinkClass',
                                )}>
                                <a
                                  href={provider.loginUrl}
                                  id={`zocial-${provider.alias}`}
                                  className={clsx(
                                    'zocial',
                                    provider.providerId,
                                  )}
                                  aria-label={`${provider.displayName}로 로그인`}>
                                  <span>{provider.displayName}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </SocialProviders>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </LoginFormWrapper>
          </Template>
        </FormPanelContent>

        {/* 푸터 */}
        <Footer>
          <FooterNav aria-label="푸터 링크">
            <FooterLink
              href="#"
              title="지금은 제공하지 않는 서비스입니다."
              onClick={(e) => e.preventDefault()}
              aria-disabled="true">
              도움말
            </FooterLink>
            <FooterDivider aria-hidden="true">|</FooterDivider>
            <FooterLink
              href="#"
              title="지금은 제공하지 않는 서비스입니다."
              onClick={(e) => e.preventDefault()}
              aria-disabled="true">
              개인정보처리방침
            </FooterLink>
            <FooterDivider aria-hidden="true">|</FooterDivider>
            <FooterLink
              href="#"
              title="지금은 제공하지 않는 서비스입니다."
              onClick={(e) => e.preventDefault()}
              aria-disabled="true">
              이용약관
            </FooterLink>
          </FooterNav>
          <FooterCopyright>
            (주)씨이랩 | 대표이사 : 채정환, 윤세혁 | 사업자등록번호 :
            119-86-31534
          </FooterCopyright>
        </Footer>
      </FormPanel>

      <BackgroundPanel $backgroundUrl={backgroundImage} aria-hidden="true" />
    </PageContainer>
  );
}

/* Layout */
const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #fff;
  overflow: hidden;

  .kcFormSocialAccountListClass {
    list-style: none;
  }

  #kc-registration {
    font-size: 14px;
    text-align: center;

    span {
      color: #90919e;
    }

    a {
      margin-left: 5px;
      color: #5b29c7;
      font-weight: 700;
    }
  }
`;

const FormPanel = styled.div`
  flex: 0 0 620px;
  height: 100%;
  padding: 30px 90px;
  display: flex;
  flex-direction: column;
`;

const FormPanelContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackgroundPanel = styled.div<{ $backgroundUrl: string }>`
  flex: 1;
  min-width: 1200px;
  height: 100%;
  background: url(${(props) => props.$backgroundUrl}) center / cover no-repeat;
`;

/* Header */
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const LogoWrapper = styled.div`
  width: 36px;
  height: 36px;
  background-color: #5b29c7;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;

    path {
      fill: white;
    }
  }
`;

const PageTitle = styled.h1`
  font-family: Pretendard, sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: 1;
  color: #000;
  margin: 0;
`;

const PageSubtitle = styled.p`
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: #333;
  margin: 0 0 36px;
`;

/* Form */
const LoginFormWrapper = styled.div`
  width: 440px;
`;

const FormGroup = styled.div``;

const FieldWrapper = styled.div`
  margin-top: 16px;
`;

const FieldLabel = styled.label`
  display: block;
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: #000;
  margin-bottom: 4px;
`;

const InputBox = styled.div<{ hasError: boolean }>`
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid ${(props) => (props.hasError ? '#fa5252' : '#e9ecef')};
  border-radius: 2px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${(props) => (props.hasError ? '#fa5252' : '#3366ff')};
  }

  input {
    flex: 1;
    height: 100%;
    padding: 8px 10px 8px 36px;
    background: transparent;
    border: none;
    font-family: Pretendard, sans-serif;
    font-size: 12px;
    color: ${(props) => (props.hasError ? '#e03131' : '#000')};

    &::placeholder {
      color: ${(props) => (props.hasError ? '#e03131' : '#555')};
    }

    &:focus {
      outline: none;
    }
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  svg {
    width: 20px;
    height: 20px;
    fill: #adb5bd;
  }
`;

const PasswordInputBox = styled(InputBox)`
  input {
    padding-right: 36px;
  }
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 0;
  cursor: pointer;
  outline: none;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: 12px;
  color: #f14a4a;
  margin-top: 8px;
`;

/* Login Options */
const LoginOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0 34px;
`;

const RememberMeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #494b4d;

  &:hover svg rect {
    stroke: #3366ff;
  }
`;

const ForgotPasswordLink = styled.a`
  font-family: Pretendard, sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #888;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }

  &:focus {
    outline: 2px solid #3366ff;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/* Submit Button */
const SubmitButtonWrapper = styled.div`
  margin-bottom: 24px;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 34px;
  background: radial-gradient(
    74.04% 44.5% at 50% 50%,
    #15155d 0%,
    #070913 100%
  );
  border: 1px solid #000;
  border-radius: 2px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  font-family: Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:focus {
    outline: 2px solid #3366ff;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SignUpPrompt = styled.p`
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: #828588;
  margin: 20px 0 0;

  a {
    margin-left: 6px;
    font-weight: 500;
    color: #544ad8;
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid #3366ff;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }
`;

/* Social Providers */
const SocialProviders = styled.nav``;

/* Footer */
const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: Pretendard, sans-serif;
  font-size: 10px;
  color: #828588;
`;

const FooterLink = styled.a`
  color: #828588;
  text-decoration: none;
  cursor: not-allowed;

  &:focus {
    outline: 2px solid #3366ff;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const FooterDivider = styled.span``;

const FooterCopyright = styled.p`
  font-family: Pretendard, sans-serif;
  font-size: 10px;
  font-weight: 400;
  text-align: center;
  color: #828588;
  margin: 0;
`;
