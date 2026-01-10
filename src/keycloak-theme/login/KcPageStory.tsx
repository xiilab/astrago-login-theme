import { createGetKcContextMock } from "keycloakify/login/KcContext";
import type { KcContextExtension, KcContextExtensionPerPage } from "./KcContext";
import { themeNames, kcEnvDefaults } from "../kc.gen";

export const { getKcContextMock } = createGetKcContextMock({
  kcContextExtension: {
    themeName: themeNames[0],
    properties: {
      ...kcEnvDefaults
    }
  } satisfies KcContextExtension,
  kcContextExtensionPerPage: {} satisfies KcContextExtensionPerPage,
  overrides: {
    // 기본 로그인 페이지 데이터 오버라이드 (필요시)
  },
  overridesPerPage: {
    // 페이지별 오버라이드 (필요시)
    "login.ftl": {
      // realm, social, login 등 커스텀 데이터
    }
  }
});
