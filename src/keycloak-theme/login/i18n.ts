import { createUseI18n } from 'keycloakify/login';

export const { useI18n } = createUseI18n({
  // NOTE: Here you can override the default i18n messages
  // or define new ones that, for example, you would have
  // defined in the Keycloak admin UI for UserProfile
  // https://user-images.githubusercontent.com/6702424/182050652-522b6fe6-8ee5-49df-aca3-dba2d33f24a5.png
  // en: {
  //     alphanumericalCharsOnly: "Only alphanumerical characters",
  //     gender: "Gender",
  //     // Here we overwrite the default english value for the message "doForgotPassword"
  //     // that is "Forgot Password?" see: https://github.com/InseeFrLab/keycloakify/blob/f0ae5ea908e0aa42391af323b6d5e2fd371af851/src/lib/i18n/generated_messages/18.0.1/login/en.ts#L17
  //     doForgotPassword: "I forgot my password",
  //     invalidUserMessage: "Invalid username or password. (this message was overwrite in the theme)"
  // },
  en: {
    'footer.systemWarning':
      'This system is only available to Doosan personnel and authorized users. Unauthorized use may result in civil and criminal penalties under applicable laws. System usage is monitored by administrators.',
    'footer.adminLogin': 'Admin Login',
    'footer.generalLogin': 'General Login',
    'footer.userGuide': 'User Guide',
  },
  ko: {
    'footer.systemWarning':
      '본 시스템은 두산 담당자 및 인가된 사용자만 사용할 수 있으며, 불법 사용시에는 법령에 의해 민/형사상의 제제를 받을 수가 있습니다. 시스템 사용은 관리자에 의해 모니터링 되고 있습니다.',
    'footer.adminLogin': '관리자 전용 로그인',
    'footer.generalLogin': '일반 전용 로그인',
    'footer.userGuide': '사용자 가이드',
  } as any,
});

export type I18n = NonNullable<ReturnType<typeof useI18n>>;
