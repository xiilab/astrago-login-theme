/**
 * LoginForm 컴포넌트 - 로그인 폼 UI
 */
import { clsx } from "keycloakify/tools/clsx";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../../KcContext";
import type { I18n } from "../../i18n";
import type { useLoginForm } from "./hooks";

// Icons
import MailIcon from "../../icons/mail.svg?react";
import LockIcon from "../../icons/lock.svg?react";
import EyeOpenIcon from "../../icons/open-eye.svg?react";
import EyeClosedIcon from "../../icons/close-eye.svg?react";
import CheckboxIcon from "../../icons/checkbox.svg?react";
import CheckboxCheckedIcon from "../../icons/checkbox-checked.svg?react";

// Styles
import {
  FormGroup,
  FieldWrapper,
  FieldLabel,
  InputBox,
  InputIcon,
  PasswordInputBox,
  PasswordToggleButton,
  ErrorMessage,
  LoginOptions,
  RememberMeButton,
  ForgotPasswordLink,
  SubmitButtonWrapper,
  SubmitButton,
  SignUpPrompt,
  SocialProviders,
  SocialProvidersList,
  SocialProviderItem,
} from "./styles";

interface LoginFormProps {
  kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
  i18n: I18n;
  doUseDefaultCss: boolean;
  classes?: Record<string, string>;
  form: ReturnType<typeof useLoginForm>;
}

export function LoginForm({
  kcContext,
  i18n,
  doUseDefaultCss,
  classes,
  form,
}: LoginFormProps) {
  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
  const { social, realm, url, auth, registrationDisabled, login } = kcContext;
  const { refs, state, actions } = form;

  const hasSocialProviders = realm.password && social?.providers !== undefined;

  return (
    <div id="kc-form">
      <div id="kc-form-wrapper">
        {realm.password && (
          <form
            id="kc-form-login"
            onSubmit={actions.handleSubmit}
            action={url.loginAction}
            method="post"
            aria-label="로그인 폼"
          >
            {/* 사용자명/이메일 입력 */}
            <FormGroup className={kcClsx("kcFormGroupClass")}>
              <FieldWrapper>
                <FieldLabel htmlFor="username">E-mail</FieldLabel>
                <InputBox hasError={!!state.errors.username}>
                  <InputIcon aria-hidden="true">
                    <MailIcon />
                  </InputIcon>
                  <input
                    ref={refs.usernameRef}
                    id="username"
                    name="username"
                    type="text"
                    tabIndex={1}
                    defaultValue={state.savedUsername || login.username || ""}
                    placeholder="이메일을 입력해 주세요."
                    autoFocus
                    autoComplete="off"
                    aria-invalid={!!state.errors.username}
                    aria-describedby={
                      state.errors.username ? "username-error" : undefined
                    }
                    onChange={actions.clearUsernameError}
                  />
                </InputBox>
                {state.errors.username && (
                  <ErrorMessage id="username-error" role="alert">
                    {state.errors.username}
                  </ErrorMessage>
                )}
              </FieldWrapper>
            </FormGroup>

            {/* 비밀번호 입력 */}
            <FormGroup className={kcClsx("kcFormGroupClass")}>
              <FieldWrapper>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInputBox hasError={!!state.errors.password}>
                  <InputIcon aria-hidden="true">
                    <LockIcon />
                  </InputIcon>
                  <input
                    ref={refs.passwordRef}
                    id="password"
                    name="password"
                    type={state.passwordVisibility.type}
                    tabIndex={2}
                    placeholder="비밀번호를 입력해 주세요."
                    autoComplete="current-password"
                    aria-invalid={!!state.errors.password}
                    aria-describedby={
                      state.errors.password || state.errors.server
                        ? "password-error"
                        : undefined
                    }
                    onChange={actions.clearPasswordError}
                  />
                  <PasswordToggleButton
                    type="button"
                    tabIndex={-1}
                    onClick={actions.togglePasswordVisibility}
                    aria-label={
                      state.passwordVisibility.isVisible
                        ? "비밀번호 숨기기"
                        : "비밀번호 표시"
                    }
                    aria-pressed={state.passwordVisibility.isVisible}
                  >
                    {state.passwordVisibility.isVisible ? (
                      <EyeOpenIcon aria-hidden="true" />
                    ) : (
                      <EyeClosedIcon aria-hidden="true" />
                    )}
                  </PasswordToggleButton>
                </PasswordInputBox>
                {state.errors.password && (
                  <ErrorMessage id="password-error" role="alert">
                    {state.errors.password}
                  </ErrorMessage>
                )}
                {!state.errors.password && state.errors.server && (
                  <ErrorMessage id="password-error" role="alert">
                    {state.errors.server}
                  </ErrorMessage>
                )}
              </FieldWrapper>
            </FormGroup>

            {/* 로그인 옵션 */}
            <LoginOptions>
              <RememberMeButton
                type="button"
                onClick={() => actions.setRememberMe(!state.rememberMe)}
                aria-pressed={state.rememberMe}
              >
                {state.rememberMe ? (
                  <CheckboxCheckedIcon
                    style={{ color: "#5B29C7" }}
                    aria-hidden="true"
                  />
                ) : (
                  <CheckboxIcon aria-hidden="true" />
                )}
                <span>아이디 저장</span>
              </RememberMeButton>

              {realm.resetPasswordAllowed && (
                <ForgotPasswordLink
                  href={`${window.location.origin}/reset-password`}
                >
                  비밀번호를 잊으셨나요?
                </ForgotPasswordLink>
              )}
            </LoginOptions>

            {/* 로그인 버튼 */}
            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
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
                  disabled={state.isSubmitting}
                  aria-busy={state.isSubmitting}
                >
                  로그인
                </SubmitButton>
              </SubmitButtonWrapper>

              {realm.password &&
                realm.registrationAllowed &&
                !registrationDisabled && (
                  <SignUpPrompt>
                    아직 계정이 없으신가요?
                    <a href={`${window.location.origin}/signup`} tabIndex={6}>
                      회원 가입하기
                    </a>
                  </SignUpPrompt>
                )}
            </div>

            {/* 소셜 로그인 */}
            {hasSocialProviders && social?.providers && (
              <SocialProviders
                id="kc-social-providers"
                aria-label="소셜 로그인"
              >
                <SocialProvidersList>
                  {social.providers.map((provider) => (
                    <SocialProviderItem key={provider.providerId}>
                      <a
                        href={provider.loginUrl}
                        id={`zocial-${provider.alias}`}
                        className={clsx("zocial", provider.providerId)}
                        aria-label={`${provider.displayName}로 로그인`}
                      >
                        <span>{provider.displayName}</span>
                      </a>
                    </SocialProviderItem>
                  ))}
                </SocialProvidersList>
              </SocialProviders>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
