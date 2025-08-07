import App from './App'
import { render } from '@testing-library/react'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve('hey'),
  })
) as jest.Mock

test('App renders without crashing', async () => {
  render(<App />)
})
