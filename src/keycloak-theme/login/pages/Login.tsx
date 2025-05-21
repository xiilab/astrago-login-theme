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
import { ReactComponent as GoogleLogoIcon } from './icons/google_logo.svg';
import { ReactComponent as WhiteLogo } from './WhiteLogo.svg';
import { ReactComponent as BlackLogo } from './BlackLogo.svg';
// import { ReactComponent as BackgroundImg } from './loginBackground.svg';
import mySvg from './loginBackground.svg';

import Footer from '../../Footer';

const ERROR_MESSAGE =
  '아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해 주세요.';

const my_custom_param = new URL(window.location.href).searchParams.get('my_custom_param');
if (my_custom_param !== null) {
  console.log('my_custom_param:', my_custom_param);
}

export default function Login(
  props: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n> & {
    displayMessage?: boolean;
  },
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes, displayMessage = true } = props;

  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const { social, realm, url, usernameHidden, login, auth, registrationDisabled, message, client } =
    kcContext;

  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const [passwordType, setPasswordType] = useState({
    type: 'password',
    visible: false,
  });

  const handlePasswordType = () => {
    setPasswordType(() => {
      if (!passwordType.visible) {
        return { type: 'text', visible: true };
      }
      return { type: 'password', visible: false };
    });
  };

  const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();

    setIsLoginButtonDisabled(true);

    const formElement = e.target as HTMLFormElement;

    //NOTE: Even if we login with email Keycloak expect username and password in
    //the POST request.
    formElement.querySelector("input[name='email']")?.setAttribute('name', 'username');

    formElement.submit();
  });
  const baseUrl = window.location.origin;
  const currentUrl = new URL(baseUrl);
  currentUrl.port = '30080';
  const newUrl = currentUrl.toString();
  // 페이지가 포커싱 될 때 마다 새로고침 => 재로그인 방지
  useEffect(() => {
    const handleFocus = () => {
      window.location.reload();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <>
      <Wrapper>
        <Container>
          <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayInfo={social.displayInfo}
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg('doLogIn')}
            infoNode={
              realm.password &&
              realm.registrationAllowed &&
              !registrationDisabled && (
                <div id="kc-registration">
                  <span>
                    Don't have account?
                    {/* <a tabIndex={6} href={url.registrationUrl}> */}
                    {/* TODO 키클락 서버와 연동으로 회원가입 페이지로 지정 */}
                    <a tabIndex={6} href={`${newUrl}register`}>
                      Create an account
                    </a>
                  </span>
                </div>
              )
            }>
            <Section>
              {/* <Title>ASTRAGO</Title> */}
              <Title>
                <BlackLogo />
              </Title>
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
                                <InputContainer showError={displayMessage && message !== undefined}>
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
                              {passwordType.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </VisibleButton>
                          </PasswordInputContainer>
                          {displayMessage && message !== undefined && (
                            <div className={clsx('alert', `alert-${message.type}`)}>
                              <ErrorText
                                className="kc-feedback-text"
                                dangerouslySetInnerHTML={{
                                  __html: ERROR_MESSAGE,
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
                      <div id="kc-form-buttons" className={getClassName('kcFormGroupClass')}>
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
                      </div>
                    </form>
                  )}
                </div>
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
                          getClassName('kcFormSocialAccountDoubleListClass'),
                      )}>
                      {social.providers.map((p) => (
                        <li
                          key={p.providerId}
                          className={getClassName('kcFormSocialAccountListLinkClass')}>
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
            backgroundImage: `url(${mySvg})`,
            backgroundPosition: 'center',
          }}>
          <BackgroundContainer data-sy="BackgroundContainer">
            <WhiteLogo />
            <LogoContent>
              <span>
                AstraGo는 자원 최적화 기술을 활용하여 GPU 서버의 활용도를 극대화하는 솔루션입니다.
              </span>
              <span>
                이를 통해 학습 시간을 단축하여 사용자의 프로젝트 계획을 더욱 향상시킵니다.
              </span>
            </LogoContent>
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
`;

const BackgroundWrapper = styled('div')`
  flex-grow: 1;
  min-width: 1000px;
`;

const BackgroundContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  gap: 15px;
  height: 100%;
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

const Title = styled('div')`
  text-align: center;
`;

const SubTitle = styled('div')`
  color: #5b29c7;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  line-height: 25px;
  margin: 32px 0 34px 0;
`;

const InputContainer = styled('div')<ErrorInputContainerProps>`
  background-color: #ffffff;
  border: ${(props) => (props.showError ? '1px solid #F14A4A' : '1px solid #D5D4D8')};
  height: 48px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 22px 0 20px;
  gap: 10px;
  transition: all 0.5s ease;

  &:focus-within {
    border: ${(props) => (props.showError ? '1px solid #F14A4A' : '1px solid #5b29c7')};
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
  border: ${(props) => (props.showError ? '1px solid #F14A4A' : '1px solid #E2E1E7')};
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

const LoginButton = styled(Button)`
  background: #5b29c7;
  border: none;
  margin-bottom: 30px;
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
