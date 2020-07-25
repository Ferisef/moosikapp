import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useAuth from '@hooks/useAuthorization';
import FlexCenterAlignment from '@components/FlexCenterAlignment';
import Form, { Input, SubmitButton, Link } from '@components/Form';
import useRestriction from '../hooks/useRestriction';

const StyledInput = styled(Input)`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 450px) {
    & {
      flex-direction: column;
      align-items: unset;
    }

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
`;

const StyledButton = styled(SubmitButton)`
  margin-left: 8px;

  @media (max-width: 450px) {
    margin-left: 0;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const restriction = useRestriction();
  restriction.disallowAuthorizedUser();

  const { authorize } = useAuth();

  return (
    <FlexCenterAlignment>
      <Form
        title="Login"
        handler={async () => {
          try {
            await authorize(username, password);
            router.push(router.query?.from?.toString() || '/');
          } catch (e) {
            // error message (e.response.data)
          }
        }}
      >
        <StyledInput type="text" required handler={setUsername}>
          Username / Email
        </StyledInput>
        <StyledInput type="password" required handler={setPassword}>
          Password
        </StyledInput>
        <Footer>
          <span>
            <Link to="/forgot">Forgot your password?</Link>
          </span>
          <div>
            <Link to="/register">Need an account?</Link>
            <StyledButton>Login</StyledButton>
          </div>
        </Footer>
      </Form>
    </FlexCenterAlignment>
  );
};

export default Login;
