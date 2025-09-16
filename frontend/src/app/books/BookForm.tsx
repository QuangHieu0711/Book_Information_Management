'use client'
import React, { useEffect, useState } from 'react'
import modalStyles from '../../styles/Form.module.css'

export type BookFormData = {
  id?: number
  title: string
  authorId: string
  categoryId: string
  publisherId: string
  yearPublished: number
  price: number
  quantity: number
  description: string
  language: string
}

type Option = { id: string; name: string }

const LANGUAGE_OPTIONS: Option[] = [
  { id: 'Tiếng Việt', name: 'Tiếng Việt' },
  { id: 'Tiếng Anh', name: 'Tiếng Anh' },
  { id: 'Tiếng Trung', name: 'Tiếng Trung' },
  { id: 'Tiếng Nhật', name: 'Tiếng Nhật' },
  { id: 'Tiếng Pháp', name: 'Tiếng Pháp' },
  { id: 'Tiếng Đức', name: 'Tiếng Đức' },
  { id: 'Tiếng Tây Ban Nha', name: 'Tiếng Tây Ban Nha' },
  { id: 'Tiếng Hàn', name: 'Tiếng Hàn' },
  { id: 'Tiếng Ý', name: 'Tiếng Ý' },
]

export default function BookForm({
  mode,
  book,
  onClose,
  onSuccess
}: {
  mode: 'add' | 'edit'
  book?: BookFormData
  onClose: () => void
  onSuccess: () => void
}) {
  const [authors, setAuthors] = useState<Option[]>([])
  const [categories, setCategories] = useState<Option[]>([])
  const [publishers, setPublishers] = useState<Option[]>([])

  const [form, setForm] = useState<BookFormData>({
    title: '',
    authorId: '',
    categoryId: '',
    publisherId: '',
    yearPublished: new Date().getFullYear(),
    price: 0,
    quantity: 1,
    description: '',
    language: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({})

  // fetch dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [aRes, cRes, pRes] = await Promise.all([
          fetch('/api/authors', { credentials: 'include' }),
          fetch('/api/categories', { credentials: 'include' }),
          fetch('/api/publishers', { credentials: 'include' })
        ])
        const [aJson, cJson, pJson] = await Promise.all([
          aRes.json(),
          cRes.json(),
          pRes.json()
        ])

        setAuthors(
          (aJson.data || []).map((a: any) => ({
            id: String(a.id),
            name: a.authorname
          }))
        )
        setCategories(
          (cJson.data || []).map((c: any) => ({
            id: String(c.id),
            name: c.categoryname
          }))
        )
        setPublishers(
          (pJson.data || []).map((p: any) => ({
            id: String(p.id),
            name: p.publisherName
          }))
        )
      } catch (err) {
        setAuthors([])
        setCategories([])
        setPublishers([])
      }
    }
    fetchOptions()
  }, [])

  // reset form
  useEffect(() => {
    if (mode === 'edit' && book) {
      setForm({
        id: book.id,
        title: book.title,
        authorId: book.authorId ? String(book.authorId) : '',
        categoryId: book.categoryId ? String(book.categoryId) : '',
        publisherId: book.publisherId ? String(book.publisherId) : '',
        yearPublished: book.yearPublished,
        price: book.price,
        quantity: book.quantity,
        description: book.description,
        language: book.language || ''
      })
    } else if (mode === 'add') {
      setForm({
        title: '',
        authorId: '',
        categoryId: '',
        publisherId: '',
        yearPublished: new Date().getFullYear(),
        price: 0,
        quantity: 1,
        description: '',
        language: ''
      })
    }
    setError(null)
    setFieldErrors({})
  }, [mode, book])

  // validate từng trường
  const validateForm = () => {
    const errs: { [key: string]: boolean } = {}
    if (!form.title.trim()) errs.title = true
    if (!form.authorId) errs.authorId = true
    if (!form.categoryId) errs.categoryId = true
    if (!form.publisherId) errs.publisherId = true
    if (!form.yearPublished || form.yearPublished < 1900) errs.yearPublished = true
    if (!form.price || form.price < 0) errs.price = true
    if (!form.quantity || form.quantity < 1) errs.quantity = true
    if (!form.language) errs.language = true
    if (!form.description.trim()) errs.description = true
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      setError('Vui lòng nhập và chọn đầy đủ thông tin!')
      return false
    }
    setError(null)
    return true
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: ['price', 'quantity', 'yearPublished'].includes(name)
        ? Number(value)
        : value
    }))
    // reset lỗi trường khi nhập
    setFieldErrors(prev => ({ ...prev, [name]: false }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const payload = {
        ...form,
        authorId: form.authorId ? Number(form.authorId) : null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        publisherId: form.publisherId ? Number(form.publisherId) : null
      }

      const res = await fetch(
        mode === 'add' ? '/api/books' : `/api/books/${book?.id}`,
        {
          method: mode === 'add' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        }
      )

      const json = await res.json()
      if (json.status) {
        onSuccess()
        onClose()
      } else {
        setError(json.userMessage || 'Lưu sách thất bại')
      }
    } catch {
      setError('Không thể kết nối server.')
    } finally {
      setLoading(false)
    }
  }

  const groupGap = 24

  return (
    <div className={modalStyles['modal-overlay']}>
      <div className={modalStyles['modal-content']}>
        <div className={modalStyles['modal-title-bar']}>
          <div className={modalStyles['modal-title']}>
            {mode === 'edit' ? 'SỬA SÁCH' : 'THÊM SÁCH MỚI'}
          </div>
          <button
            type='button'
            className={modalStyles['close-btn']}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ fontFamily: 'inherit' }} noValidate>
          {/* Tên sách */}
          <div className={modalStyles['form-group']} style={{ marginBottom: groupGap }}>
            <label className={modalStyles['form-label']}>
              Tên sách <span style={{ color: '#e53935' }}>*</span>
            </label>
            <input
              className={`${modalStyles['input']} ${fieldErrors.title ? modalStyles['input-error'] : ''}`}
              name='title'
              value={form.title}
              onChange={handleChange}
              maxLength={255}
              placeholder='Nhập tên sách...'
            />
          </div>

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: groupGap,
              marginBottom: groupGap
            }}
          >
            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: groupGap }}>
              {/* Tác giả */}
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Tác giả <span style={{ color: '#e53935' }}>*</span>
                </label>
                <select
                  className={`${modalStyles['input']} ${fieldErrors.authorId ? modalStyles['input-error'] : ''}`}
                  name='authorId'
                  value={form.authorId}
                  onChange={handleChange}
                >
                  <option value=''>-- Chọn tác giả --</option>
                  {authors.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thể loại */}
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Thể loại <span style={{ color: '#e53935' }}>*</span>
                </label>
                <select
                  className={`${modalStyles['input']} ${fieldErrors.categoryId ? modalStyles['input-error'] : ''}`}
                  name='categoryId'
                  value={form.categoryId}
                  onChange={handleChange}
                >
                  <option value=''>-- Chọn thể loại --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Giá */}
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Giá (VNĐ) <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={`${modalStyles['input']} ${fieldErrors.price ? modalStyles['input-error'] : ''}`}
                  name='price'
                  type='number'
                  min={0}
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: groupGap }}>
              {/* NXB */}
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Nhà xuất bản <span style={{ color: '#e53935' }}>*</span>
                </label>
                <select
                  className={`${modalStyles['input']} ${fieldErrors.publisherId ? modalStyles['input-error'] : ''}`}
                  name='publisherId'
                  value={form.publisherId}
                  onChange={handleChange}
                >
                  <option value=''>-- Chọn NXB --</option>
                  {publishers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Năm xuất bản */}
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Năm xuất bản <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={`${modalStyles['input']} ${fieldErrors.yearPublished ? modalStyles['input-error'] : ''}`}
                  name='yearPublished'
                  type='number'
                  min={1900}
                  max={3000}
                  value={form.yearPublished}
                  onChange={handleChange}
                />
              </div>

              {/* Số lượng */}
              <div className={modalStyles['form-group']}>
                <label className={modalStyles['form-label']}>
                  Số lượng <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  className={`${modalStyles['input']} ${fieldErrors.quantity ? modalStyles['input-error'] : ''}`}
                  name='quantity'
                  type='number'
                  min={1}
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Ngôn ngữ */}
          <div className={modalStyles['form-group']} style={{ marginBottom: groupGap }}>
            <label className={modalStyles['form-label']}>
              Ngôn ngữ <span style={{ color: '#e53935' }}>*</span>
            </label>
            <select
              className={`${modalStyles['input']} ${fieldErrors.language ? modalStyles['input-error'] : ''}`}
              name='language'
              value={form.language}
              onChange={handleChange}
            >
              <option value=''>-- Chọn ngôn ngữ --</option>
              {LANGUAGE_OPTIONS.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mô tả */}
          <div className={modalStyles['form-group']} style={{ marginBottom: groupGap }}>
            <label className={modalStyles['form-label']}>
              Mô tả <span style={{ color: '#e53935' }}>*</span>
            </label>
            <textarea
              className={`${modalStyles['input']} ${fieldErrors.description ? modalStyles['input-error'] : ''}`}
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder='Nhập mô tả về cuốn sách...'
            />
          </div>

          {error && (
            <div className={modalStyles['error-message']}>{error}</div>
          )}

          {/* Footer */}
          <div className={modalStyles['form-footer']}>
            <button
              type='button'
              className={modalStyles['btn-cancel']}
              onClick={onClose}
              disabled={loading}
            >
              Hủy bỏ
            </button>
            <button
              type='submit'
              className={modalStyles['btn-confirm']}
              disabled={loading}
            >
              {loading ? 'Đang xác nhận...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
