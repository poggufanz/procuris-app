import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { EmployeeForm } from './EmployeeForm'

function renderForm(onDone = () => {}) {
  const qc = new QueryClient()
  return render(
    <QueryClientProvider client={qc}>
      <EmployeeForm onDone={onDone} />
      <Toaster />
    </QueryClientProvider>,
  )
}

test('blocks submit when required fields are empty', async () => {
  renderForm()
  await userEvent.click(screen.getByRole('button', { name: /Simpan/i }))
  expect((await screen.findAllByText(/wajib/i)).length).toBeGreaterThan(0)
})

test('submits a valid employee and calls onDone', async () => {
  const onDone = vi.fn()
  renderForm(onDone)
  await userEvent.type(screen.getByLabelText(/Nama/i), 'Siti Aminah')
  await userEvent.type(screen.getByLabelText(/NIK/i), '2026.02.00010')
  await screen.findByRole('option', { name: 'Bandung' })
  await userEvent.selectOptions(screen.getByLabelText(/Cabang/i), '1')
  await userEvent.selectOptions(screen.getByLabelText(/Jabatan/i), '2')
  await userEvent.type(screen.getByLabelText(/Tanggal gabung/i), '2026-02-01')
  await userEvent.type(screen.getByLabelText(/Mulai kontrak/i), '2026-02-01')
  await userEvent.click(screen.getByRole('button', { name: /Simpan/i }))
  await screen.findByText(/Karyawan disimpan/i)
  expect(onDone).toHaveBeenCalled()
})
