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
  username?: string;
  password?: string;
  server?: string;
}

interface UseLoginFormReturn {
  refs: {
    usernameRef: React.RefObject<HTMLInputElement>;
    passwordRef: React.RefObject<HTMLInputElement>;
  };
  state: {
    isSubmitting: boolean;
    passwordVisibility: PasswordVisibility;
    errors: FormErrors;
    rememberMe: boolean;
    savedUsername: string;
  };
  actions: {
    handleSubmit: FormEventHandler<HTMLFormElement>;
    togglePasswordVisibility: () => void;
    setRememberMe: (value: boolean) => void;
    clearUsernameError: () => void;
    clearPasswordError: () => void;
  };
}

/**
 * 로그인 폼 상태 및 로직 관리 훅
 */
export function useLoginForm(
  kcContext: Extract<KcContext, { pageId: "login.ftl" }>
): UseLoginFormReturn {
  const { message } = kcContext;

  // Refs
  const usernameRef = useRef<HTMLInputElement>(null);
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

  // localStorage에서 저장된 사용자명과 체크 상태 불러오기
  const [savedUsername] = useState(() => {
    try {
      return localStorage.getItem("savedUsername") || "";
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
  const clearUsernameError = useCallback(() => {
    setErrors((prev) => ({ ...prev, username: undefined }));
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

      const usernameValue = usernameRef.current?.value.trim();
      const passwordValue = passwordRef.current?.value.trim();

      // 사용자명 유효성 검사
      if (!usernameValue) {
        setIsSubmitting(false);
        setErrors({ username: "이메일을 입력해 주세요." });
        usernameRef.current?.focus();
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
          localStorage.setItem("savedUsername", usernameValue);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("rememberMe");
        }
      } catch {
        // localStorage 접근 실패 시 무시
      }

      setErrors({});
      (e.target as HTMLFormElement).submit();
    },
    [rememberMe]
  );

  return {
    refs: { usernameRef, passwordRef },
    state: {
      isSubmitting,
      passwordVisibility,
      errors,
      rememberMe,
      savedUsername,
    },
    actions: {
      handleSubmit,
      togglePasswordVisibility,
      setRememberMe,
      clearUsernameError,
      clearPasswordError,
    },
  };
}
