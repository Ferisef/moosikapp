import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useRestriction from '../hooks/useRestriction';
import useAuthorization from '../hooks/useAuthorization';
import Form, {
  TextInput, Link, Button, TextInputType,
} from '../components/Form';
import CenteringComponent from '../components/CenteringComponent';

const StyledTextInput = styled(TextInput)`
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

const StyledButton = styled(Button)`
  margin-left: 8px;

  @media (max-width: 450px) {
    margin-left: 0;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const restriction = useRestriction();
  restriction.disallowAuthorizedUser();

  const authorization = useAuthorization();

  const router = useRouter();

  return (
    <CenteringComponent>
      <Form
        title="Login"
        handler={async () => {
          try {
            await authorization.authorize(username, password);
            router.push(router.query?.from?.toString() || '/');
          } catch (e) {
            // error message (e.response.data)
          }
        }}
      >
        <StyledTextInput type={TextInputType.text} required handler={setUsername}>
          Username / Email
        </StyledTextInput>
        <StyledTextInput type={TextInputType.password} required handler={setPassword}>
          Password
        </StyledTextInput>
        <Footer>
          <Link to="/forgot">Forgot your password?</Link>
          <div>
            <Link to="/register">Need an account?</Link>
            <StyledButton>Login</StyledButton>
          </div>
        </Footer>
      </Form>
    </CenteringComponent>
  );
};

export default Login;
