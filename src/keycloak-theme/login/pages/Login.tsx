import { useState, type FormEventHandler } from 'react';
import { clsx } from 'keycloakify/tools/clsx';
import { useConstCallback } from 'keycloakify/tools/useConstCallback';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';
import styled from '@emotion/styled';

import { ReactComponent as MailIcon } from './icons/mail_outline_white.svg';
import { ReactComponent as LockIcon } from './icons/lock_outline_white.svg';
import { ReactComponent as VisibilityOffIcon } from './icons/visibility_off_white.svg';
import { ReactComponent as VisibilityIcon } from './icons/remove_red_eye_white.svg';
import { ReactComponent as GoogleLogoIcon } from './icons/google_logo.svg';
import Footer from '../../Footer';

const my_custom_param = new URL(window.location.href).searchParams.get(
  'my_custom_param'
);
if (my_custom_param !== null) {
  console.log('my_custom_param:', my_custom_param);
}

export default function Login(
  props: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n>
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

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
  } = kcContext;

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
    formElement
      .querySelector("input[name='email']")
      ?.setAttribute('name', 'username');

    formElement.submit();
  });

  return (
    <>
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
                  <a tabIndex={6} href={url.registrationUrl}>
                    Create an account
                  </a>
                </span>
              </div>
            )
          }
        >
          <Section>
            <Title>Uyuni</Title>
            <SubTitle>Login to your Account</SubTitle>
            <div
              id="kc-form"
              className={clsx(
                realm.password &&
                  social.providers !== undefined &&
                  getClassName('kcContentWrapperClass')
              )}
            >
              <div
                id="kc-form-wrapper"
                className={clsx(
                  realm.password &&
                    social.providers && [
                      getClassName('kcFormSocialAccountContentClass'),
                      getClassName('kcFormSocialAccountClass'),
                    ]
                )}
              >
                {realm.password && (
                  <form
                    id="kc-form-login"
                    onSubmit={onSubmit}
                    action={url.loginAction}
                    method="post"
                  >
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
                              <InputContainer>
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
                                  autoComplete="off"
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
                      <PasswordInputContainer>
                        <LockIcon />
                        <input
                          tabIndex={2}
                          id="password"
                          className={getClassName('kcInputClass')}
                          name="password"
                          type={passwordType.type}
                          autoComplete="off"
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

                    <GoogleLoginButton>
                      <GoogleLogoIcon />
                      <p>Login of Google</p>
                    </GoogleLoginButton>
                    <div
                      id="kc-form-buttons"
                      className={getClassName('kcFormGroupClass')}
                    >
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
                    getClassName('kcFormSocialAccountClass')
                  )}
                >
                  <ul
                    className={clsx(
                      getClassName('kcFormSocialAccountListClass'),
                      social.providers.length > 4 &&
                        getClassName('kcFormSocialAccountDoubleListClass')
                    )}
                  >
                    {social.providers.map((p) => (
                      <li
                        key={p.providerId}
                        className={getClassName(
                          'kcFormSocialAccountListLinkClass'
                        )}
                      >
                        <a
                          href={p.loginUrl}
                          id={`zocial-${p.alias}`}
                          className={clsx('zocial', p.providerId)}
                        >
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
      </Container>
      <Footer></Footer>
    </>
  );
}

const Container = styled('div')`
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Section = styled('div')`
  margin: 0 auto;
  width: 462px;
`;

const Title = styled('div')`
  color: #ffffff;
  /* margin-top: 180px; */
  font-size: 40px;
  font-weight: 700;
  line-height: 46.88px;
  text-align: center;
`;

const SubTitle = styled('div')`
  color: #ff7525;
  size: 18px;
  text-align: center;
  line-height: 25.01px;
  margin-top: 38px;
  margin-bottom: 42px;
`;

const InputContainer = styled('div')`
  background-color: #373737;
  height: 52px;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 22px 0 20px;
  gap: 12px;

  input {
    width: 360px;
    height: 28px;
    background: transparent;
    border-color: transparent;
    color: #ffffff;
  }

  input::placeholder {
    size: 14px;
    font-style: normal;
  }

  input:focus {
    outline: none;
  }
`;

const PasswordInputContainer = styled(InputContainer)`
  margin-top: 20px;
  margin-bottom: 6px;
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
  color: #7a7a7a;
  align-items: center;
  margin: 59px 0;
  p {
    font-size: 14px;
    line-height: 25px;
  }
`;

const Line = styled('div')`
  width: 200px;
  border-top: 1px solid #7a7a7a;
`;

const Button = styled('button')`
  width: 462px;
  height: 54px;
  border-radius: 10px;
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
  background: #131314;
  border: 1px solid #8e918f;
  margin-bottom: 20px;
  p {
    font-weight: 500;
    font-size: 16px;
    color: #bfbfbf;
    margin: 0;
  }
`;

const LoginButton = styled(Button)`
  background: #ff7525;
  border: none;
  margin-bottom: 16px;
  input {
    background: transparent;
    border: none;
    color: #ffffff;
    font-weight: 700;
    font-size: 16px;
  }
`;
