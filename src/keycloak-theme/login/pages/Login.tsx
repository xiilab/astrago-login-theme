import { useState, useEffect, type FormEventHandler } from 'react';
import { clsx } from 'keycloakify/tools/clsx';
import { useConstCallback } from 'keycloakify/tools/useConstCallback';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';
import styled from '@emotion/styled';

import { ReactComponent as MailIcon } from './icons/mail_outline.svg';
import { ReactComponent as LockIcon } from './icons/lock_outline.svg';
import { ReactComponent as VisibilityOffIcon } from './icons/visibility_off_white.svg';
import { ReactComponent as VisibilityIcon } from './icons/remove_red_eye_white.svg';
import microsoftLogo from './microsoft_logo.png';
import background from '../assets/test2.svg';
import logo from './white-logo.png';
import Footer from '../../Footer';
import { setCookie, getCookie, deleteCookie } from './shared/cookieUtils';

const my_custom_param = new URL(window.location.href).searchParams.get(
  'my_custom_param',
);
if (my_custom_param !== null) {
  console.log('my_custom_param:', my_custom_param);
}

export default function Login(
  props: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n> & {
    displayMessage?: boolean;
  },
) {
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    displayMessage = true,
  } = props;

  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    auth,
    registrationDisabled,
    message,
    client,
  } = kcContext;

  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const [passwordType, setPasswordType] = useState({
    type: 'password',
    visible: false,
  });
  // validation 메시지 상태 추가
  const [validationMessage, setValidationMessage] = useState<
    string | undefined
  >(undefined);

  // ===== onSubmit 함수 수정 =====
  const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();

    setIsLoginButtonDisabled(true);

    const formElement = e.target as HTMLFormElement;
    const emailInput = formElement.querySelector(
      "input[name='email']",
    ) as HTMLInputElement;
    const username = emailInput?.value || '';

    // 비밀번호 공백 체크
    const passwordInput = formElement.querySelector(
      "input[name='password']",
    ) as HTMLInputElement;
    if (!passwordInput || passwordInput.value.trim() === '') {
      setIsLoginButtonDisabled(false);
      setValidationMessage('비밀번호를 입력해 주세요.');
      passwordInput?.focus();
      return;
    }

    // 쿠키에서 실패 정보 확인
    const failInfo = getCookie(`login_fail_${username}`);
    if (failInfo) {
      try {
        const { count, until } = JSON.parse(failInfo);
        const now = Date.now();
        if (count >= 5 && now < until) {
          setValidationMessage(
            '보안 정책으로 이 기기에서 로그인 시도가 제한되었습니다. 5분 후 다시 시도하세요.',
          );
          setIsLoginButtonDisabled(false);
          return;
        }
      } catch (e) {
        // 쿠키 파싱 오류 시 무시
      }
    }

    //NOTE: Even if we login with email Keycloak expect username and password in
    //the POST request.
    formElement
      .querySelector("input[name='email']")
      ?.setAttribute('name', 'username');

    setValidationMessage(undefined); // 로그인 시도 전 메시지 초기화
    formElement.submit();
  });
  // ===== onSubmit 함수 끝 =====

  // handlePasswordType 함수 복원
  const handlePasswordType = () => {
    setPasswordType(() => {
      if (!passwordType.visible) {
        return { type: 'text', visible: true };
      }
      return { type: 'password', visible: false };
    });
  };

  // kcContext.message.summary가 존재하는 경우 message 상태 업데이트 및 실패 횟수 관리
  useEffect(() => {
    if (message?.summary) {
      setValidationMessage(message.summary);

      // 실패한 계정명 추출
      const form = document.getElementById(
        'kc-form-login',
      ) as HTMLFormElement | null;
      let emailInput = form?.querySelector(
        "input[name='email']",
      ) as HTMLInputElement | null;
      if (!emailInput) {
        // 이미 name이 username으로 바뀌었을 수 있음
        emailInput = form?.querySelector(
          "input[name='username']",
        ) as HTMLInputElement | null;
      }
      const username = emailInput?.value || login.username || '';

      if (username) {
        const failInfo = getCookie(`login_fail_${username}`);
        let count = 1;
        let until = 0;
        const now = Date.now();
        if (failInfo) {
          try {
            const parsed = JSON.parse(failInfo);
            count = parsed.count + 1;
            until = parsed.until;
          } catch (e) {
            // 쿠키 파싱 오류 시 무시
          }
        }
        if (count >= 5) {
          until = now + 5 * 60 * 1000; // 5분 제한
          setCookie(
            `login_fail_${username}`,
            JSON.stringify({ count, until }),
            5,
          );
        } else {
          setCookie(
            `login_fail_${username}`,
            JSON.stringify({ count, until: 0 }),
            5,
          );
        }
      }
    } else {
      // 로그인 성공 시 쿠키 삭제
      const username = login.username || '';
      if (username) {
        deleteCookie(`login_fail_${username}`);
      }
    }
  }, [message]);

  return (
    <>
      <Wrapper>
        <Container>
          <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayInfo={social.displayInfo}
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg('doLogIn')}>
            <Section>
              {/* <Title>ASTRAGO</Title> */}
              <Title>DooGPU</Title>
              <SubTitle>Login to your Account</SubTitle>
              <div
                id="kc-form"
                className={clsx(
                  realm.password &&
                    social.providers !== undefined &&
                    getClassName('kcContentWrapperClass'),
                )}>
                <div
                  id="kc-form-wrapper"
                  className={clsx(
                    realm.password &&
                      social.providers && [
                        getClassName('kcFormSocialAccountContentClass'),
                        getClassName('kcFormSocialAccountClass'),
                      ],
                  )}>
                  {realm.password && (
                    <form
                      id="kc-form-login"
                      onSubmit={onSubmit}
                      action={url.loginAction}
                      method="post">
                      <div className={getClassName('kcFormGroupClass')}>
                        {!usernameHidden &&
                          (() => {
                            const label = !realm.loginWithEmailAllowed
                              ? 'username'
                              : realm.registrationEmailAsUsername
                                ? 'email'
                                : 'usernameOrEmail';

                            const autoCompleteHelper: typeof label =
                              label === 'usernameOrEmail' ? 'username' : label;

                            return (
                              <>
                                {/* <label
                              htmlFor={autoCompleteHelper}
                              className={getClassName('kcLabelClass')}
                            >
                              {msg(label)}
                            </label> */}
                                <InputContainer
                                  showError={
                                    displayMessage && message !== undefined
                                  }>
                                  <MailIcon />
                                  <input
                                    tabIndex={1}
                                    id={autoCompleteHelper}
                                    className={getClassName('kcInputClass')}
                                    //NOTE: This is used by Google Chrome auto fill so we use it to tell
                                    //the browser how to pre fill the form but before submit we put it back
                                    //to username because it is what keycloak expects.
                                    name={autoCompleteHelper}
                                    defaultValue={login.username}
                                    placeholder="E-mail"
                                    type="text"
                                    autoFocus={true}
                                  />
                                </InputContainer>
                              </>
                            );
                          })()}
                      </div>
                      <div className={getClassName('kcFormGroupClass')}>
                        {/* <label
                      htmlFor="password"
                      className={getClassName('kcLabelClass')}
                    >
                      {msg('password')}
                    </label> */}
                        <PasswordInputWrapper>
                          <PasswordInputContainer
                            showError={displayMessage && message !== undefined}>
                            <LockIcon />
                            <input
                              tabIndex={2}
                              id="password"
                              className={getClassName('kcInputClass')}
                              name="password"
                              type={passwordType.type}
                              placeholder="Password"
                            />
                            <VisibleButton onClick={handlePasswordType}>
                              {passwordType.visible ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </VisibleButton>
                          </PasswordInputContainer>
                          {displayMessage &&
                            (validationMessage !== undefined ||
                              message !== undefined) && (
                              <div
                                className={clsx(
                                  'alert',
                                  `alert-${message?.type}`,
                                )}>
                                <ErrorText
                                  className="kc-feedback-text"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      validationMessage ||
                                      message?.summary ||
                                      '',
                                  }}
                                />
                              </div>
                            )}
                        </PasswordInputWrapper>
                      </div>

                      {/* <div
                    className={clsx(
                      getClassName('kcFormGroupClass'),
                      getClassName('kcFormSettingClass')
                    )}
                  > */}
                      {/* <div id="kc-form-options">
                      {realm.rememberMe && !usernameHidden && (
                        <div className="checkbox">
                          <label>
                            <input
                              tabIndex={3}
                              id="rememberMe"
                              name="rememberMe"
                              type="checkbox"
                              {...(login.rememberMe === 'on'
                                ? {
                                    checked: true,
                                  }
                                : {})}
                            />
                            {msg('rememberMe')}
                          </label>
                        </div>
                      )}
                    </div> */}
                      {/* <ResetWrapper>
                      {realm.resetPasswordAllowed && (
                        <a tabIndex={5} href={url.loginResetCredentialsUrl}>
                          Find Password
                        </a>
                      )}
                    </ResetWrapper> */}
                      {/* </div> */}
                      <DivisorWrapper>
                        <Line />
                        <p>or</p>
                        <Line />
                      </DivisorWrapper>

                      {/* <GoogleLoginButton>
                        <GoogleLogoIcon />
                        <p>Login of Google</p>
                      </GoogleLoginButton> */}
                      <div
                        id="kc-form-buttons"
                        className={getClassName('kcFormGroupClass')}>
                        <input
                          type="hidden"
                          id="id-hidden-input"
                          name="credentialId"
                          {...(auth?.selectedCredential !== undefined
                            ? {
                                value: auth.selectedCredential,
                              }
                            : {})}
                        />
                        <LoginButtonWrapper>
                          <LoginButton>
                            <input
                              tabIndex={4}
                              // className={clsx(
                              // getClassName('kcButtonClass'),
                              // getClassName('kcButtonPrimaryClass'),
                              // getClassName('kcButtonBlockClass'),
                              // getClassName('kcButtonLargeClass')
                              // )}
                              name="login"
                              id="kc-login"
                              type="submit"
                              // value={msgStr('doLogIn')}
                              value="LOG IN"
                              disabled={isLoginButtonDisabled}
                            />
                          </LoginButton>
                          {realm.password && social.providers !== undefined && (
                            <div
                              id="kc-social-providers"
                              className={clsx(
                                getClassName('kcFormSocialAccountContentClass'),
                                getClassName('kcFormSocialAccountClass'),
                              )}>
                              <ul
                                className={clsx(
                                  getClassName('kcFormSocialAccountListClass'),
                                  social.providers.length > 4 &&
                                    getClassName(
                                      'kcFormSocialAccountDoubleListClass',
                                    ),
                                )}>
                                {social.providers.map((p) => (
                                  <li
                                    key={p.providerId}
                                    className={getClassName(
                                      'kcFormSocialAccountListLinkClass',
                                    )}>
                                    <a
                                      href={p.loginUrl}
                                      id={`zocial-${p.alias}`}
                                      className={clsx('zocial', p.providerId)}>
                                      <span>{p.displayName}</span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {/* 임시로 추가된 소셜 로그인 버튼, 추후 삭제 필요 */}
                          <div
                            id="kc-social-providers"
                            className="kcFormSocialAccountContentClass col-xs-12 col-sm-6 kcFormSocialAccountClass login-pf-social-section">
                            <ul className="kcFormSocialAccountListClass login-pf-social list-unstyled login-pf-social-all">
                              <li className="kcFormSocialAccountListLinkClass login-pf-social-link">
                                <a
                                  href="/auth/realms/astrago/broker/azuread/login?client_id=astrago-client&tab_id=zJEx9rladzM&session_code=7HEag5tm3ZTAmbDQiILFEur36PXuhMMaYQ_fI7edBXY"
                                  id="zocial-azuread"
                                  className="zocial oidc">
                                  <span>azuread</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </LoginButtonWrapper>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </Section>
          </Template>
          <FooterWrapper>
            <Footer></Footer>
          </FooterWrapper>
        </Container>
        <BackgroundWrapper
          data-sy="BackgroundWrapper"
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
          }}>
          <BackgroundContainer data-sy="BackgroundContainer">
            <img src={logo} alt="logo" />
          </BackgroundContainer>
        </BackgroundWrapper>
      </Wrapper>
    </>
  );
}
const FooterWrapper = styled('div')`
  position: absolute;
  bottom: 0;
`;

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;

  & .kcFormSocialAccountListClass {
    list-style: none;
  }

  /* 동적으로 생성되는 Azure AD 로그인 버튼 스타일 */
  #zocial-azuread {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
    background: #ffffff !important;
    border: 1px solid #d5d4d8 !important;
    border-radius: 8px !important;
    padding: 12px 16px !important;
    text-decoration: none !important;
    color: #17171f !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    transition: all 0.2s ease !important;
    position: relative !important;

    &:hover {
      background: #f8f8f8 !important;
      border-color: #5b29c7 !important;
    }

    /* Microsoft 로고 이미지를 :before 가상 요소로 추가 */
    &:before {
      content: '';
      width: 18px;
      height: 18px;
      background-image: url(${microsoftLogo});
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      flex-shrink: 0;
      display: inline-block;
    }

    /* 기존 텍스트를 숨기고 새로운 텍스트 표시 */
    span {
      color: #17171f !important;
      font-weight: 500 !important;
      display: none !important;
    }

    /* 새로운 텍스트를 :after 가상 요소로 추가 */
    &:after {
      content: 'Azure Login' !important;
      color: #17171f !important;
      font-weight: 700 !important;
      font-size: 16px !important;
    }
  }
`;

const BackgroundWrapper = styled('div')`
  flex-grow: 1;
  min-width: 1000px;
  position: relative;
`;

const BackgroundContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  gap: 15px;
  height: 100%;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);

  & img {
    width: 100%;
    height: 80px;
  }
`;

const LogoTitle = styled('div')`
  font-weight: 700;
  font-size: 50px;
  text-align: center;
`;

const LogoContent = styled('div')`
  span {
    display: block;
    line-height: 28px;
  }
  font-weight: 500;
  font-size: 16px;
  text-align: center;
`;

const Container = styled('div')`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 620px;

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

const Section = styled('div')`
  margin: 0 auto;
  width: 380px;
`;

const Title = styled('h1')`
  text-align: center;
  font-size: 56px;
  font-weight: 700;
  color: #005eb8;
  margin: 0;
  font-family: 'Work Sans', sans-serif;
`;

const SubTitle = styled('div')`
  color: #005eb8;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  line-height: 25px;
  margin: 15px 0 34px 0;
`;

const InputContainer = styled('div')<ErrorInputContainerProps>`
  background-color: #ffffff;
  border: ${(props) =>
    props.showError ? '1px solid #F14A4A' : '1px solid #D5D4D8'};
  height: 48px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 22px 0 20px;
  gap: 10px;
  transition: all 0.5s ease;

  &:focus-within {
    border: ${(props) =>
      props.showError ? '1px solid #F14A4A' : '1px solid #5b29c7'};
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

const PasswordInputWrapper = styled('div')`
  position: relative;
`;

interface ErrorInputContainerProps {
  showError: boolean;
}

const PasswordInputContainer = styled(InputContainer)<ErrorInputContainerProps>`
  margin-top: 16px;
  border: ${(props) =>
    props.showError ? '1px solid #F14A4A' : '1px solid #E2E1E7'};
`;

// const ResetWrapper = styled('div')`
//   text-align: right;
//   text-decoration: none;
//   margin-bottom: 27px;
//   a {
//     color: #7a7a7a;
//     font-size: 12px;
//   }
// `;

const DivisorWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #cccccc;
  align-items: center;
  margin: 40px 0;
  p {
    font-size: 14px;
    line-height: 25px;
    text-align: center;
    width: 54px;
  }
`;

const Line = styled('div')`
  width: 200px;
  border-top: 1px solid #cccccc;
`;

const Button = styled('button')`
  width: 380px;
  height: 54px;
  border-radius: 12px;
  cursor: pointer;
`;

const VisibleButton = styled('div')`
  background: transparent;
  cursor: pointer;
  border: none;
  height: 18px;
`;
const GoogleLoginButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: #ffffff;
  border: 1px solid #d5d4d8;
  margin-bottom: 16px;
  p {
    font-weight: 500;
    font-size: 14px;
    color: #afadb4;
    margin: 0;
  }
`;

const LoginButtonWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
`;

const LoginButton = styled(Button)`
  background: #005eb8;
  border: none;
  input {
    background: transparent;
    border: none;
    color: #ffffff;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
  }
`;

const ErrorText = styled('div')`
  color: #f14a4a;
  font-size: 11px;
  line-height: 16px;
  position: absolute;
  bottom: -30px;
  left: 10px;
`;
