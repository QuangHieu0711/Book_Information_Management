import React, { useState } from 'react'
import styles from '../../styles/Form.module.css'

export type UserAddForm = {
  username: string
  password: string
  role: string
  fullName: string
}

export type UserEditForm = {
  id: number
  username: string
  role: string
  fullName: string
}

interface UserFormProps {
  mode: 'add' | 'edit'
  user?: UserEditForm
  onClose: () => void
  onSuccess: () => void
}

export default function UserForm({ mode, user, onClose, onSuccess }: UserFormProps) {
  const [form, setForm] = useState<UserAddForm | UserEditForm>(
    mode === 'edit'
      ? { id: user?.id!, username: user?.username ?? '', role: user?.role ?? '', fullName: user?.fullName ?? '' }
      : { username: '', password: '', role: 'user', fullName: '' }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      let res
      if (mode === 'add') {
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form)
        })
      } else {
        res = await fetch(`/api/users/${(form as UserEditForm).id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            username: form.username,
            role: form.role,
            fullName: form.fullName
          })
        })
      }
      const json = await res.json()
      if (json.status) {
        onSuccess()
        onClose()
      } else {
        setError(json.userMessage || 'Lỗi xử lý')
      }
    } catch {
      setError('Lỗi mạng hoặc server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['modal-overlay']}>
      <form className={styles['modal-content']} onSubmit={handleSubmit}>
        {/* Tiêu đề xanh đậm */}
        <div className={styles['modal-title-bar']}>
          <div className={styles['modal-title']}>{mode === 'add' ? 'THÊM TÀI KHOẢN' : 'SỬA TÀI KHOẢN'}</div>
          <button type='button' className={styles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        {/* Bố cục 2 cột */}
        <div className={styles['form-grid']}>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Tên đăng nhập</label>
            <input name='username' value={form.username} onChange={handleChange} required className={styles['input']} />
          </div>
          {mode === 'add' && (
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Mật khẩu</label>
              <div className={styles['input-password-wrap']}>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={(form as UserAddForm).password ?? ''}
                  onChange={handleChange}
                  required
                  className={styles['input']}
                />
                <button
                  type='button'
                  className={styles['toggle-password-btn']}
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <svg height='20' width='20' viewBox='0 0 24 24'>
                      <path
                        fill='#0d47a1'
                        d='M12 4.5C7.305 4.5 3.133 7.364 1.5 12c.486 1.292 1.252 2.525 2.27 3.632l-1.417 1.417 1.414 1.415 1.42-1.42A10.956 10.956 0 0 0 12 19.5c4.695 0 8.867-2.864 10.5-7.5A10.91 10.91 0 0 0 20.283 8.37l1.42-1.42-1.414-1.415-1.417 1.417A10.956 10.956 0 0 0 12 4.5zm0 2c3.478 0 6.61 1.974 8.077 5.5C18.61 15.026 15.478 17 12 17a8.964 8.964 0 0 1-7.077-5.5A8.964 8.964 0 0 1 12 6.5zm0 2a3.5 3.5 0 0 0-3.5 3.5c0 .256.021.507.062.751l2.189-2.19a1.5 1.5 0 0 1 2.121 2.122l-2.189 2.188c.244.042.495.063.751.063a3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 12 8.5z'
                      />
                    </svg>
                  ) : (
                    <svg height='20' width='20' viewBox='0 0 24 24'>
                      <path
                        fill='#0d47a1'
                        d='M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7zm0-10a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Vai trò</label>
            <select
              name='role'
              value={form.role}
              onChange={handleChange}
              required
              className={styles['input']}
              style={{ height: 38 }}
            >
              <option value='admin'>ADMIN</option>
              <option value='user'>USER</option>
            </select>
          </div>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Họ tên</label>
            <input name='fullName' value={form.fullName} onChange={handleChange} required className={styles['input']} />
          </div>
        </div>
        {error && <div className={styles['error-message']}>{error}</div>}
        <div className={styles['form-footer']}>
          <button type='button' onClick={onClose} className={styles['btn-cancel']}>
            Hủy bỏ
          </button>
          <button type='submit' className={styles['btn-confirm']} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Xác nhận'}
          </button>
        </div>
      </form>
    </div>
  )
}
