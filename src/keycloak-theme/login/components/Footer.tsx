/**
 * Footer 컴포넌트 - 로그인 페이지 하단 푸터
 */
import styled from "@emotion/styled";

export function Footer() {
  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <FooterContainer>
      <FooterNav aria-label="푸터 링크">
        <FooterLink
          href="#"
          title="지금은 제공하지 않는 서비스입니다."
          onClick={handleDisabledClick}
          aria-disabled="true"
        >
          도움말
        </FooterLink>
        <FooterDivider aria-hidden="true">|</FooterDivider>
        <FooterLink
          href="#"
          title="지금은 제공하지 않는 서비스입니다."
          onClick={handleDisabledClick}
          aria-disabled="true"
        >
          개인정보처리방침
        </FooterLink>
        <FooterDivider aria-hidden="true">|</FooterDivider>
        <FooterLink
          href="#"
          title="지금은 제공하지 않는 서비스입니다."
          onClick={handleDisabledClick}
          aria-disabled="true"
        >
          이용약관
        </FooterLink>
      </FooterNav>
      <FooterCopyright>
        (주)씨이랩 | 대표이사 : 채정환, 윤세혁 | 사업자등록번호 : 119-86-31534
      </FooterCopyright>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: Pretendard, sans-serif;
  font-size: 10px;
  color: #828588;
`;

const FooterLink = styled.a`
  color: #828588;
  text-decoration: none;
  cursor: not-allowed;

  &:focus {
    outline: 2px solid #3366ff;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const FooterDivider = styled.span``;

const FooterCopyright = styled.p`
  font-family: Pretendard, sans-serif;
  font-size: 10px;
  font-weight: 400;
  text-align: center;
  color: #828588;
  margin: 0;
`;
