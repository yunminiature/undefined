/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangeAvatarForm } from './ChangeAvatarForm';

// ---------- UI mocks (shadcn/ui passthrough) ----------
jest.mock('../ui/form', () => ({
  Form: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  FormItem: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  FormControl: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  FormLabel: ({ children, ...rest }: any) => <label {...rest}>{children}</label>,
  FormDescription: ({ children, ...rest }: any) => <p {...rest}>{children}</p>,
  FormMessage: ({ children, ...rest }: any) => <span {...rest}>{children}</span>,
}));

jest.mock('../ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement> & { 'data-testid'?: string }) => (
    <input data-testid={props.type === 'file' ? 'file-input' : undefined} {...props} />
  ),
}));

jest.mock('../ui/button', () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
}));

// ---------- Constants / utils / toast ----------
jest.mock('./ChangeAvatarForm.constants', () => ({
  ALLOWED_TYPES: ['image/png', 'image/jpeg'],
  TITLE: {
    AVATAR: {
      LABEL: 'Avatar',
      DESCRIPTION: 'Upload PNG or JPEG.',
    },
  },
}));

// Упростим схему валидации: требуется наличие поля avatar (File)
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async (values: any) => ({
    values: values?.avatar ? values : {},
    errors: values?.avatar ? {} : { avatar: { message: 'Required', type: 'required' } },
  }),
}));

jest.mock('./ChangeAvatarForm.utils', () => ({
  getAvatarErrorMessage: () => 'Boom',
}));

const success = jest.fn();
const error = jest.fn();
jest.mock('sonner', () => ({
  toast: {
    success: (...args: any[]) => success(...args),
    error: (...args: any[]) => error(...args),
  },
}));

// ---------- RTK Query hook mock (typed) ----------
import * as usersApi from '@/api/users';

jest.mock('@/api/users', () => ({
  useChangeAvatarMutation: jest.fn(),
}));

type MutationTuple = ReturnType<typeof usersApi.useChangeAvatarMutation>;
type Trigger = MutationTuple[0];
type MutationState = MutationTuple[1];

const triggerMock: jest.MockedFunction<Trigger> = jest.fn() as unknown as jest.MockedFunction<Trigger>;

const createMutationState = (overrides: Partial<MutationState> = {}): MutationState => ({
  isUninitialized: true,
  isLoading: false,
  isSuccess: false,
  isError: false,
  status: 'uninitialized',
  reset: jest.fn(),
  originalArgs: undefined,
  data: undefined as any,
  error: undefined as any,
  ...overrides,
});

const setMutationState = (opts: { isLoading?: boolean; unwrapReject?: boolean } = {}) => {
  const { isLoading = false, unwrapReject = false } = opts;

  triggerMock.mockImplementation(
    (..._args: Parameters<Trigger>) =>
      ({
        unwrap: unwrapReject ? jest.fn().mockRejectedValue(new Error('err')) : jest.fn().mockResolvedValue({}),
      } as unknown as ReturnType<Trigger>)
  );

  (usersApi.useChangeAvatarMutation as jest.MockedFunction<typeof usersApi.useChangeAvatarMutation>).mockReturnValue([
    triggerMock,
    createMutationState({
      isLoading,
      isUninitialized: !isLoading,
      status: isLoading ? 'pending' : 'uninitialized',
    }),
  ] as MutationTuple);
};

// ---------- helpers ----------
const createFile = (name = 'avatar.png', type = 'image/png') => new File(['file-content'], name, { type });

// ---------- tests ----------
describe('ChangeAvatarForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render label and description and have Save disabled by default', () => {
    setMutationState();
    render(<ChangeAvatarForm onClose={jest.fn()} />);

    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('Upload PNG or JPEG.')).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    expect(saveBtn).toBeDisabled();
  });

  it('should enable Save after choosing an allowed file', async () => {
    setMutationState();
    render(<ChangeAvatarForm onClose={jest.fn()} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    await userEvent.upload(fileInput, createFile());

    const saveBtn = await screen.findByRole('button', { name: 'Save' });
    await waitFor(() => expect(saveBtn).toBeEnabled());
  });

  it('should submit, call mutation, show success toast and close on success', async () => {
    const onClose = jest.fn();
    setMutationState();
    render(<ChangeAvatarForm onClose={onClose} />);

    const file = createFile();
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    const saveBtn = await screen.findByRole('button', { name: 'Save' });
    await userEvent.click(saveBtn);

    expect(triggerMock).toHaveBeenCalledTimes(1);
    const fdArg = triggerMock.mock.calls[0][0] as FormData;
    expect(fdArg).toBeInstanceOf(FormData);
    expect(fdArg.get('avatar')).toBe(file);

    await waitFor(() => {
      expect(success).toHaveBeenCalledWith('Avatar updated');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      const save = screen.getByRole('button', { name: 'Save' });
      expect(save).toBeDisabled();
    });
  });

  it('should show error toast and not close on failure', async () => {
    const onClose = jest.fn();
    setMutationState({ unwrapReject: true });
    render(<ChangeAvatarForm onClose={onClose} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    await userEvent.upload(fileInput, createFile());

    const saveBtn = await screen.findByRole('button', { name: 'Save' });
    await userEvent.click(saveBtn);

    await waitFor(() => {
      expect(error).toHaveBeenCalledWith('Boom');
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it('should set proper accept attribute according to ALLOWED_TYPES', () => {
    setMutationState();
    render(<ChangeAvatarForm onClose={jest.fn()} />);
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    expect(fileInput).toHaveAttribute('accept', 'image/png,image/jpeg');
  });

  it('should call onClose and reset on Cancel', async () => {
    const onClose = jest.fn();
    setMutationState();
    render(<ChangeAvatarForm onClose={onClose} />);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    await userEvent.upload(fileInput, createFile());

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      const save = screen.getByRole('button', { name: 'Save' });
      expect(save).toBeDisabled();
    });
  });

  it('should show "Saving…" and keep Save disabled while loading', () => {
    setMutationState({ isLoading: true });
    render(<ChangeAvatarForm onClose={jest.fn()} />);
    const savingBtn = screen.getByRole('button', { name: 'Saving…' });
    expect(savingBtn).toBeDisabled();
  });
});
