import React, { useState } from 'react'
import modalStyles from '../../styles/Form.module.css'

export type PublisherEditForm = {
  id: number
  publisherName: string
  address: string
  phone: string
  email: string
  website: string
  isActive: boolean
}

type PublisherFormProps = {
  mode: 'add' | 'edit'
  publisher?: PublisherEditForm
  onClose: () => void
  onSuccess: () => void
}

export default function PublisherForm({ mode, publisher, onClose, onSuccess }: PublisherFormProps) {
  const [publisherName, setPublisherName] = useState(publisher?.publisherName || '')
  const [address, setAddress] = useState(publisher?.address || '')
  const [phone, setPhone] = useState(publisher?.phone || '')
  const [email, setEmail] = useState(publisher?.email || '')
  const [website, setWebsite] = useState(publisher?.website || '')
  const [isActive, setIsActive] = useState<boolean>(publisher?.isActive ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = mode === 'edit'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!publisherName.trim()) {
      setError('Tên nhà xuất bản không được để trống')
      return
    }
    if (!address.trim()) {
      setError('Địa chỉ không được để trống')
      return
    }
    if (!phone.trim()) {
      setError('Số điện thoại không được để trống')
      return
    }
    if (!email.trim()) {
      setError('Email không được để trống')
      return
    }
    if (!website.trim()) {
      setError('Website không được để trống')
      return
    }

    setLoading(true)
    try {
      const body = { publisherName, address, phone, email, website, isActive }
      let res, json
      if (isEdit && publisher) {
        res = await fetch(`/api/publishers/${publisher.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      } else {
        res = await fetch('/api/publishers', {
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
            {isEdit ? 'SỬA NHÀ XUẤT BẢN' : 'THÊM NHÀ XUẤT BẢN'}
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
                  Tên nhà xuất bản <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={modalStyles['input']}
                  value={publisherName}
                  onChange={e => setPublisherName(e.target.value)}
                  maxLength={128}
                  required
                />
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Số điện thoại <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={modalStyles['input']}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  maxLength={20}
                  required
                />
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Trạng thái
                </label>
                <select
                  className={modalStyles['input']}
                  value={isActive ? 'active' : 'inactive'}
                  onChange={e => setIsActive(e.target.value === 'active')}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngưng</option>
                </select>
              </div>
            </div>
            {/* Cột 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Địa chỉ <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={modalStyles['input']}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  maxLength={255}
                  required
                />
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Email <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={modalStyles['input']}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Website <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={modalStyles['input']}
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  maxLength={255}
                  required
                />
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
