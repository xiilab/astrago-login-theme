import styled from '@emotion/styled';

import slogan from './login/pages/slogan.png';

interface FooterProps {
  showAdminButton?: boolean;
  onAdminClick?: () => void;
}

const Footer = ({ showAdminButton = false, onAdminClick }: FooterProps) => {
  return (
    <Wrapper>
      <Section>
        <img src={slogan} alt="slogan" />
      </Section>
      <Section>
        본 시스템은 두산 담당자 및 인가된 사용자만 사용할 수 있으며, 불법
        사용시에는 법령에 의해 민/형사상의 제제를 받을 수가 있습니다. 시스템
        사용은 관리자에 의해 모니터링 되고 있습니다.
      </Section>
      {showAdminButton && (
        <AdminSection>
          <AdminModeButton onClick={onAdminClick}>
            관리자 전용 로그인
          </AdminModeButton>
        </AdminSection>
      )}
    </Wrapper>
  );
};

const Wrapper = styled('footer')`
  height: 128px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Section = styled('section')`
  span {
    display: block;
    text-align: center;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  color: #000;
  font-weight: 300;
  line-height: 22px;
  letter-spacing: -2%;
  max-height: 80px;
  & img {
    width: 420px;
    height: 40px;
  }

  padding: 0 100px;
`;

const AdminSection = styled('section')`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-top: 2px;
`;

const AdminModeButton = styled('button')`
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  color: #005eb8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  padding: 0;

  &:hover {
    color: #003d7a;
  }
`;

// const RightLayout = styled('div')`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 38px;
// `;

// const LocaleSelectBox = styled('button')`
//   border: 1px solid #b7b7b7;
//   width: 86px;
//   height: 34px;
//   border-radius: 100px;
//   background: transparent;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   span {
//     font-size: 12px;
//     color: #b7b7b7;
//   }
// `;
export default Footer;
