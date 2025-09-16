'use client'
import React, { useState, useEffect } from 'react'
import formStyles from '../../styles/Form.module.css'

export type BorrowFormData = {
  id?: number
  userId: string
  borrowDate: string
  returnDate: string
  status: string
}

interface BorrowFormProps {
  mode: 'add' | 'edit'
  borrow?: BorrowFormData
  onClose: () => void
  onSuccess: (message: string) => void
}

function BorrowForm({ mode, borrow, onClose, onSuccess }: BorrowFormProps) {
  const [formData, setFormData] = useState<BorrowFormData>({
    userId: '',
    borrowDate: '',
    returnDate: '',
    status: 'MUON',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<{ id: number; name: string }[]>([])

  // Lấy danh sách người dùng
  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (borrow) {
      setFormData(borrow)
    } else if (mode === 'add') {
      setFormData({
        userId: '',
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        status: 'MUON',
      })
    }
  }, [borrow, mode])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { credentials: 'include' })
      const json = await res.json()
      if (json.status) {
        setUsers(json.data)
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách người dùng:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = borrow?.id 
        ? `/api/borrows/${borrow.id}` 
        : `/api/borrows`
      
      const body = {
        ...formData,
        userId: parseInt(formData.userId),
        borrowDate: formData.borrowDate,
        returnDate: formData.returnDate,
        status: formData.status,
      }

      const res = await fetch(url, {
        method: borrow?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      const json = await res.json()
      if (json.status) {
        onSuccess(mode === 'add' ? 'Thêm phiếu mượn thành công' : 'Cập nhật phiếu mượn thành công')
        onClose()
      } else {
        setError(json.userMessage || 'Có lỗi xảy ra')
      }
    } catch (err) {
      setError('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={formStyles['form-overlay']}>
      <div className={formStyles['form-content']} style={{ maxWidth: 500 }}>
        <div className={formStyles['form-title-bar']}>
          <div className={formStyles['form-title']}>
            {mode === 'add' ? 'THÊM PHIẾU MƯỢN' : 'SỬA PHIẾU MƯỢN'}
          </div>
          <button type="button" className={formStyles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className={formStyles['form']}>
          {error && <div className={formStyles['error']}>{error}</div>}
          
          <div className={formStyles['form-group']}>
            <label htmlFor="userId">Người mượn:</label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className={formStyles['form-input']}
            >
              <option value="">Chọn người mượn</option>
              {users.map(user => (
                <option key={user.id} value={user.id.toString()}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className={formStyles['form-group']}>
            <label htmlFor="borrowDate">Ngày mượn:</label>
            <input
              type="date"
              id="borrowDate"
              name="borrowDate"
              value={formData.borrowDate}
              onChange={handleChange}
              required
              className={formStyles['form-input']}
            />
          </div>

          <div className={formStyles['form-group']}>
            <label htmlFor="returnDate">Ngày hẹn trả:</label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className={formStyles['form-input']}
            />
          </div>

          <div className={formStyles['form-group']}>
            <label htmlFor="status">Trạng thái:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className={formStyles['form-input']}
            >
              <option value="MUON">MƯỢN</option>
              <option value="DA TRA">ĐÃ TRẢ</option>
            </select>
          </div>

          <div className={formStyles['form-footer']}>
            <button type="button" onClick={onClose} className={formStyles['btn-cancel']}>
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className={formStyles['btn-submit']}
            >
              {loading ? 'Đang lưu...' : (mode === 'add' ? 'Thêm phiếu mượn' : 'Cập nhật')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BorrowForm
