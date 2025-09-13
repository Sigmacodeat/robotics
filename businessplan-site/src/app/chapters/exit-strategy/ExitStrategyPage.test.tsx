import { render } from '@testing-library/react';
import ExitStrategyPage from './page';

describe('ExitStrategyPage', () => {
  it('should match snapshot', () => {
    const { container } = render(<ExitStrategyPage />);
    expect(container).toMatchSnapshot();
  });
});
