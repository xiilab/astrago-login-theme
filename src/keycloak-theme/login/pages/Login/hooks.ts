/**
 * Login 폼 관련 커스텀 훅
 */
import { useState, useRef, useCallback, type FormEventHandler } from "react";
import type { KcContext } from "../../KcContext";

interface PasswordVisibility {
  type: "password" | "text";
  isVisible: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  server?: string;
}

interface UseLoginFormReturn {
  refs: {
    emailRef: React.RefObject<HTMLInputElement>;
    passwordRef: React.RefObject<HTMLInputElement>;
  };
  state: {
    isSubmitting: boolean;
    passwordVisibility: PasswordVisibility;
    errors: FormErrors;
    rememberMe: boolean;
    savedEmail: string;
  };
  actions: {
    handleSubmit: FormEventHandler<HTMLFormElement>;
    togglePasswordVisibility: () => void;
    setRememberMe: (value: boolean) => void;
    clearEmailError: () => void;
    clearPasswordError: () => void;
  };
}

/**
 * 로그인 폼 상태 및 로직 관리 훅
 */
export function useLoginForm(
  kcContext: Extract<KcContext, { pageId: "login.ftl" }>
): UseLoginFormReturn {
  const { url, login, message } = kcContext;

  // Refs
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<PasswordVisibility>({
    type: "password",
    isVisible: false,
  });
  const [errors, setErrors] = useState<FormErrors>({
    server: message?.summary,
  });

  // localStorage에서 저장된 이메일과 체크 상태 불러오기
  const [savedEmail] = useState(() => {
    try {
      return localStorage.getItem("savedEmail") || "";
    } catch {
      return "";
    }
  });

  const [rememberMe, setRememberMeState] = useState(() => {
    try {
      return localStorage.getItem("rememberMe") === "true";
    } catch {
      return false;
    }
  });

  // Actions
  const clearEmailError = useCallback(() => {
    setErrors((prev) => ({ ...prev, email: undefined }));
  }, []);

  const clearPasswordError = useCallback(() => {
    setErrors((prev) => ({ ...prev, password: undefined, server: undefined }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((prev) => ({
      type: prev.isVisible ? "password" : "text",
      isVisible: !prev.isVisible,
    }));
  }, []);

  const setRememberMe = useCallback((value: boolean) => {
    setRememberMeState(value);
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const emailValue = emailRef.current?.value.trim();
      const passwordValue = passwordRef.current?.value.trim();

      // 이메일 유효성 검사
      if (!emailValue) {
        setIsSubmitting(false);
        setErrors({ email: "이메일을 입력해 주세요." });
        emailRef.current?.focus();
        return;
      }

      // 비밀번호 유효성 검사
      if (!passwordValue) {
        setIsSubmitting(false);
        setErrors({ password: "비밀번호를 입력해 주세요." });
        passwordRef.current?.focus();
        return;
      }

      // 아이디 저장 처리
      try {
        if (rememberMe) {
          localStorage.setItem("savedEmail", emailValue);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("rememberMe");
        }
      } catch {
        // localStorage 접근 실패 시 무시
      }

      // Keycloak은 'username' 필드명을 기대
      if (emailRef.current) {
        emailRef.current.setAttribute("name", "username");
      }

      setErrors({});
      (e.target as HTMLFormElement).submit();
    },
    [rememberMe]
  );

  return {
    refs: { emailRef, passwordRef },
    state: {
      isSubmitting,
      passwordVisibility,
      errors,
      rememberMe,
      savedEmail,
    },
    actions: {
      handleSubmit,
      togglePasswordVisibility,
      setRememberMe,
      clearEmailError,
      clearPasswordError,
    },
  };
}
