import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      doLogIn: '로그인',
      doRegister: '등록하다',
      doCancel: '취소',
      doSubmit: '제출하다',
      doBack: '뒤쪽에',
      doYes: '예',
      doNo: '아니요',
      doContinue: '계속하다',
      doIgnore: '무시하다',
      doAccept: '수용하다',
      doDecline: '감소',
      doForgotPassword: '비밀번호를 잊으 셨나요?',
      doClickHere: '여기를 클릭하세요',
      doImpersonate: '가장',
      doTryAgain: '다시 시도하십시오',
      doTryAnotherWay: '다른 방법을 시도해 보세요',
      doConfirmDelete: '삭제 확인',
      errorDeletingAccount: '계정을 삭제하는 중 오류가 발생했습니다.',
      noAccount: '새로운 사용자?',
      username: '사용자 이름',
      usernameOrEmail: '아이디 또는 이메일',
      firstName: '이름',
      lastName: '성',
      email: '이메일',
      password: '비밀번호',
      passwordConfirm: '비밀번호 확인',
      passwordNew: '새 비밀번호',
      passwordNewConfirm: '새로운 비밀번호 확인',
      hidePassword: '비밀번호 숨기기',
      showPassword: '비밀번호 표시',
      rememberMe: '날 기억해',
      invalidUserMessage: '아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해 주세요.',
      invalidUsernameMessage: '잘못된 사용자 이름.',
      invalidUsernameOrEmailMessage: '사용자 이름이나 이메일이 잘못되었습니다.',
      invalidPasswordMessage: '유효하지 않은 비밀번호.',
      invalidEmailMessage: '잘못된 이메일 주소.',
      accountDisabledMessage: '계정이 비활성화되었습니다. 관리자에게 문의하세요.',
      expiredCodeMessage: '로그인 시간이 초과되었습니다. 다시 로그인해 주세요.',
      missingEmailMessage: '이메일을 지정해 주세요.',
      missingUsernameMessage: '사용자 이름을 지정하십시오.',
      missingPasswordMessage: '비밀번호를 지정해주세요.',
      notMatchPasswordMessage: '비밀번호가 일치하지 않습니다.',
      successLogout: '로그아웃되었습니다',
      backToLogin: '&laquo; 로그인으로 돌아가기',
      restartLoginTooltip: '로그인 다시 시작',
    }
  })
  .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
