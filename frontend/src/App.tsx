import { Global } from '@emotion/react';
import styled from '@emotion/styled';
import { Calendar } from '@/components/Calendar';
import { globalStyles } from '@/utils/theme';

const Layout = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px;
`;

export function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <Layout>
        <Calendar />
      </Layout>
    </>
  );
}
