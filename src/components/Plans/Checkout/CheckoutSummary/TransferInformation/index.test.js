import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import DopplerIntlProvider from '../../../../../i18n/DopplerIntlProvider';
import { TransferInformation } from '.';

const renderTransferInformation = (props) =>
  render(
    <DopplerIntlProvider locale="es">
      <BrowserRouter>
        <TransferInformation {...props} />
      </BrowserRouter>
    </DopplerIntlProvider>,
  );

describe('TransferInformation', () => {
  let writeTextMock;

  beforeEach(() => {
    writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      get: () => ({
        writeText: writeTextMock,
      }),
    });
  });

  it('should render picture 16 variant for Argentina when upgrade is pending', () => {
    const { container } = renderTransferInformation({ billingCountry: 'ar', upgradePending: true });

    expect(screen.getByTestId('dp-transfer-picture-16')).toBeInTheDocument();
    expect(
      screen.getByText(/Completa el pago realizando un dep[oó]sito o transferencia/i),
    ).toBeInTheDocument();
    expect(screen.getByText('BBVA BANCO FRANCES S.A.')).toBeInTheDocument();
    expect(screen.getByText('Biside SRL')).toBeInTheDocument();
    expect(screen.getByText('30-7119594-1')).toBeInTheDocument();
    expect(screen.getByText('090/408227/0')).toBeInTheDocument();
    expect(screen.getByText('0170090920000040822703')).toBeInTheDocument();
    expect(screen.getByText('BISIDE')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Copiar/i })).toHaveLength(2);
    expect(
      Array.from(container.querySelectorAll('[data-testid="dp-transfer-banking-details"] p')).map(
        (node) => node.textContent,
      ),
    ).toEqual([
      'Banco: BBVA BANCO FRANCES S.A.',
      'Titular: Biside SRL',
      'CUIT: 30-7119594-1',
      'CC: 090/408227/0',
      'CBU: 0170090920000040822703',
      'Alias: BISIDE',
    ]);
    expect(screen.getByRole('link', { name: 'billing@fromdoppler.com' })).toHaveAttribute(
      'href',
      'mailto:billing@fromdoppler.com',
    );
    expect(screen.getByText(/Una vez que realices el pago/i)).toBeInTheDocument();
    expect(
      screen.getAllByText((_, node) => node?.textContent?.includes('Cuando confirmemos')),
    ).not.toHaveLength(0);
    expect(
      screen.getByText(/Mientras tanto, te invitamos a continuar explorando tu cuenta/i),
    ).toBeInTheDocument();
    const exploreLink = screen.getByRole('link', { name: /Explorar Doppler/i });
    const separator = container.querySelector('hr.dp-separator');
    expect(exploreLink).toHaveAttribute('href', '/dashboard');
    expect(separator).not.toBeNull();
    expect(
      separator?.compareDocumentPosition(exploreLink) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen.queryByText(
        /Revisa tu correo, y dentro de las proximas 24 horas h[aá]biles recibir[aá]s la factura/i,
      ),
    ).not.toBeInTheDocument();
  });

  it('should copy the transfer alias to clipboard', async () => {
    const user = userEvent.setup();

    renderTransferInformation({ billingCountry: 'ar', upgradePending: true });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Copiar Alias' }));
    });

    expect(await screen.findByText('Copiado')).toBeInTheDocument();
  });

  it('should keep legacy transfer information when upgrade is not pending', () => {
    renderTransferInformation({ billingCountry: 'ar', upgradePending: false });

    expect(screen.queryByTestId('dp-transfer-picture-16')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        /Revisa tu correo, y dentro de las proximas 24 horas h[aá]biles recibir[aá]s la factura/i,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('BBVA BANCO FRANCES S.A.')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'billing@fromdoppler.com' })).not.toBeInTheDocument();
  });

  it.each(['mx', 'co'])(
    'should keep legacy transfer information for %s when upgrade is pending',
    (billingCountry) => {
      renderTransferInformation({ billingCountry, upgradePending: true });

      expect(screen.queryByTestId('dp-transfer-picture-16')).not.toBeInTheDocument();
      expect(
        screen.getByText(
          /Revisa tu correo, y dentro de las proximas 24 horas h[aá]biles recibir[aá]s la factura/i,
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText('BBVA BANCO FRANCES S.A.')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'billing@fromdoppler.com' }),
      ).not.toBeInTheDocument();
    },
  );
});
