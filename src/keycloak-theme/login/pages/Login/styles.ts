/**
 * Login 페이지 스타일 컴포넌트
 */
import styled from "@emotion/styled";

// ============================================================
// Layout
// ============================================================

export const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: #fff;
`;

export const PageContainerInner = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const FormPanel = styled.div`
  width: 620px;
  flex-shrink: 0;
  height: 100%;
  padding: 30px 90px;
  display: flex;
  flex-direction: column;
`;

export const FormPanelContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BackgroundPanel = styled.div<{ $backgroundUrl: string }>`
  flex: 1;
  min-width: 620px;
  height: 100%;
  background: url(${(props) => props.$backgroundUrl}) center / cover no-repeat;
`;

export const LoginFormWrapper = styled.div`
  width: 440px;
`;

// ============================================================
// Header
// ============================================================

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const LogoWrapper = styled.div`
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

export const PageTitle = styled.h1`
  font-family: Pretendard, sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: 1;
  color: #000;
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: #333;
  margin: 0 0 36px;
`;

// ============================================================
// Form Elements
// ============================================================

export const FormGroup = styled.div``;

export const FieldWrapper = styled.div`
  margin-top: 16px;
`;

export const FieldLabel = styled.label`
  display: block;
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: #000;
  margin-bottom: 4px;
`;

export const InputBox = styled.div<{ hasError?: boolean }>`
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid ${(props) => (props.hasError ? "#fa5252" : "#e9ecef")};
  border-radius: 2px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${(props) => (props.hasError ? "#fa5252" : "#3366ff")};
  }

  input {
    flex: 1;
    height: 100%;
    padding: 8px 10px 8px 36px;
    background: transparent;
    border: none;
    font-family: Pretendard, sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    color: ${(props) => (props.hasError ? "#e03131" : "#000")};

    &::placeholder {
      color: ${(props) => (props.hasError ? "#e03131" : "#555")};
      font-weight: 400;
      line-height: 1.5;
    }

    &:focus {
      outline: none;
      font-weight: 400;
      line-height: 1.5;
    }
  }
`;

export const InputIcon = styled.span`
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

export const PasswordInputBox = styled(InputBox)`
  input {
    padding-right: 36px;
  }
`;

export const PasswordToggleButton = styled.button`
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

export const ErrorMessage = styled.span`
  display: block;
  font-size: 12px;
  color: #f14a4a;
  margin-top: 8px;
`;

// ============================================================
// Login Options
// ============================================================

export const LoginOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0 34px;
`;

export const RememberMeButton = styled.button`
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

export const ForgotPasswordLink = styled.a`
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

// ============================================================
// Buttons
// ============================================================

export const SubmitButtonWrapper = styled.div`
  margin-bottom: 24px;
`;

export const SubmitButton = styled.button`
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

export const SignUpPrompt = styled.p`
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

// ============================================================
// Social Providers
// ============================================================

export const SocialProviders = styled.nav`
  margin-top: 20px;
`;

export const SocialProvidersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SocialProviderItem = styled.li`
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    text-decoration: none;
    color: #333;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8f9fa;
    }
  }
`;
