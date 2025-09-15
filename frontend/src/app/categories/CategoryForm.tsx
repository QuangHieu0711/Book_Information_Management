'use client'
import React, { useState } from 'react'
import modalStyles from '../../styles/Form.module.css'

export type CategoryEditForm = {
  id: number
  categoryname: string
}

type CategoryFormProps = {
  mode: 'add' | 'edit'
  category?: CategoryEditForm
  onClose: () => void
  onSuccess: () => void
}

export default function CategoryForm({ mode, category, onClose, onSuccess }: CategoryFormProps) {
  const [categoryname, setCategoryname] = useState(category?.categoryname || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = mode === 'edit'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!categoryname.trim()) {
      setError('Tên thể loại không được để trống')
      return
    }

    setLoading(true)
    try {
      const body = { categoryname }
      let res, json
      if (isEdit && category) {
        res = await fetch(`/api/categories/${category.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
      } else {
        res = await fetch('/api/categories', {
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
            {isEdit ? 'SỬA THỂ LOẠI' : 'THÊM THỂ LOẠI'}
          </div>
          <button type="button" className={modalStyles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <div className={modalStyles['form-group']}>
              <label className={modalStyles['form-label']}>
                Tên thể loại <span style={{ color: '#e53935' }}>*</span>
              </label>
              <input
                className={modalStyles['input']}
                value={categoryname}
                onChange={e => setCategoryname(e.target.value)}
                maxLength={128}
                required
              />
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
