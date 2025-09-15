import React, { useState } from 'react'
import modalStyles from '../../styles/Form.module.css'

export type AuthorEditForm = {
  id: number
  authorname: string
  birthYear: number
  nationality: string
}

const NATIONALITIES = [
  "Việt Nam", "Anh", "Mỹ", "Pháp", "Nhật Bản", "Hàn Quốc", "Trung Quốc",
  "Thái Lan", "Đức", "Ý", "Tây Ban Nha", "Canada", "Úc", "Nga", "Ấn Độ",
  "Brazil", "Singapore", "Malaysia", "Indonesia", "Lào", "Campuchia"
]

type AuthorFormProps = {
  mode: 'add' | 'edit'
  author?: AuthorEditForm
  onClose: () => void
  onSuccess: () => void
}

export default function AuthorForm({ mode, author, onClose, onSuccess }: AuthorFormProps) {
  const [authorname, setAuthorname] = useState(author?.authorname || '')
  const [birthYear, setBirthYear] = useState<number>(author?.birthYear || 0)
  const [nationality, setNationality] = useState(author?.nationality || NATIONALITIES[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = mode === 'edit'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!authorname.trim()) {
      setError('Tên tác giả không được để trống')
      return
    }

    setLoading(true)
    try {
      const body = { authorname, birthYear, nationality }
      let res, json
      if (isEdit && author) {
        res = await fetch(`/api/authors/${author.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      } else {
        res = await fetch('/api/authors', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      }
      json = await res.json()
      if (json.status) {
        onClose()
        onSuccess()
      } else {
        setError(json.userMessage || 'Thao tác thất bại')
      }
    } catch {
      setError('Lỗi mạng hoặc máy chủ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={modalStyles['modal-overlay']}>
      <div className={modalStyles['modal-content']}>
        <div className={modalStyles['modal-title-bar']}>
          <div className={modalStyles['modal-title']}>
            {isEdit ? 'SỬA TÁC GIẢ' : 'THÊM TÁC GIẢ'}
          </div>
          <button type="button" className={modalStyles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0 24px',
              rowGap: 0,
              marginBottom: 16,
              alignItems: 'start',
            }}
          >
            {/* Cột 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Tên tác giả <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={modalStyles['input']}
                  value={authorname}
                  onChange={e => setAuthorname(e.target.value)}
                  maxLength={128}
                  required
                />
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>Năm sinh</label>
                <input
                  className={modalStyles['input']}
                  type="number"
                  min={1900}
                  max={new Date().getFullYear()}
                  value={birthYear || ''}
                  onChange={e => setBirthYear(Number(e.target.value))}
                  placeholder="VD: 1955"
                  required
                />
              </div>
            </div>
            {/* Cột 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>Quốc tịch</label>
                <select
                  className={modalStyles['input']}
                  value={nationality}
                  onChange={e => setNationality(e.target.value)}
                  required
                >
                  {NATIONALITIES.map(n => (
                    <option value={n} key={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {error && <div className={modalStyles['error-message']}>{error}</div>}
          <div className={modalStyles['form-footer']}>
            <button
              type="button"
              className={modalStyles['btn-cancel']}
              onClick={onClose}
              disabled={loading}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className={modalStyles['btn-confirm']}
              disabled={loading}
            >
              {loading ? (isEdit ? 'Đang xác nhận...' : 'Đang xác nhận...') : (isEdit ? 'Xác nhận' : 'Xác nhận')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
